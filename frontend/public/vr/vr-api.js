// VR API for AI VR Tutor integration
// Provides global methods for video progress tracking and data loading

(function() {
    'use strict';

    // Global VR API object
    window.VR_API = {
        // State management
        state: {
            currentTopic: 'organic-chemistry-basics',
            videoProgress: 0,
            unlocked: {
                quiz: false,
                video: true,
                flashcards: true
            },
            topicsCompleted: []
        },

        // Load flashcards for a topic
        loadFlashcards: async function(topicId) {
            try {
                // Try API first
                const response = await fetch(`/api/flashcards?topic=${topicId}`);
                if (response.ok) {
                    const flashcards = await response.json();
                    this.updateFlashcardsPanel(flashcards);
                    return flashcards;
                }
            } catch (error) {
                console.log('API unavailable, using fallback seeds');
            }

            // Fallback to seeds
            try {
                const seedsResponse = await fetch('/vr/seeds.json');
                const seeds = await seedsResponse.json();
                const topic = seeds.topics.find(t => t.id === topicId);
                if (topic) {
                    const flashcards = seeds.flashcards.filter(f => f.topicId === topicId);
                    this.updateFlashcardsPanel(flashcards);
                    return flashcards;
                }
            } catch (error) {
                console.error('Failed to load seeds:', error);
                this.updateFlashcardsPanel([]);
            }
        },

        // Update flashcards panel content
        updateFlashcardsPanel: function(flashcards) {
            const content = document.getElementById('flash-content');
            if (!content) return;

            if (flashcards.length === 0) {
                content.setAttribute('value', '📚 Flashcards\n\nNo flashcards available\nfor this topic.\n\n[Close: ESC]');
                return;
            }

            let flashText = '📚 Flashcards\n\n';
            flashcards.slice(0, 5).forEach((card, index) => {
                flashText += `${index + 1}. ${card.front}\n`;
            });
            flashText += '\n[Close: ESC]';
            
            content.setAttribute('value', flashText);
        },

        // Video progress tracking
        onVideoProgress: function(percent) {
            this.state.videoProgress = percent;
            console.log(`Video progress: ${percent}%`);

            if (percent >= 60 && !this.state.unlocked.quiz) {
                this.unlockQuiz();
            }
        },

        // Unlock quiz hotspot
        unlockQuiz: function() {
            this.state.unlocked.quiz = true;
            const quizHotspot = document.getElementById('hotspot-quiz');
            const quizContent = document.getElementById('quiz-content');
            
            if (quizHotspot) {
                quizHotspot.setAttribute('material', 'color: #7C659C; opacity: 0.9');
                quizHotspot.disabled = false;
            }

            if (quizContent) {
                quizContent.setAttribute('value', '❓ Take Quiz\n\n✅ Quiz Unlocked!\nClick to start quiz\n\n[Close: ESC]');
            }

            console.log('Quiz unlocked!');
        },

        // Mark topic as complete
        markTopicComplete: function() {
            const topicId = this.state.currentTopic;
            if (!this.state.topicsCompleted.includes(topicId)) {
                this.state.topicsCompleted.push(topicId);
            }

            // Update current topic panel
            const topicTitle = document.getElementById('topic-title');
            const topicName = document.getElementById('topic-name');
            
            if (topicTitle && topicName) {
                topicTitle.setAttribute('value', '✅ Topic Complete!');
                topicName.setAttribute('value', 'Select next topic');
                topicName.setAttribute('color', '#8D78AF');
            }

            console.log(`Topic ${topicId} marked complete`);
        },

        // Set current topic
        setCurrentTopic: function(topicId, topicName) {
            this.state.currentTopic = topicId;
            
            const topicNameEl = document.getElementById('topic-name');
            if (topicNameEl) {
                topicNameEl.setAttribute('value', topicName || 'Loading...');
            }

            // Reset unlock states for new topic
            this.state.unlocked.quiz = false;
            this.state.videoProgress = 0;
            
            // Reset quiz hotspot
            const quizHotspot = document.getElementById('hotspot-quiz');
            if (quizHotspot) {
                quizHotspot.setAttribute('material', 'opacity: 0.4');
                quizHotspot.disabled = true;
            }

            // Load new flashcards
            this.loadFlashcards(topicId);
        },

        // Open video in new tab/modal
        openVideo: function() {
            const topicId = this.state.currentTopic;
            const videoUrl = `/learn/video?topic=${topicId}&vr=true`;
            
            // Post message to parent if in iframe
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'VR_OPEN_VIDEO',
                    topic: topicId,
                    url: videoUrl
                }, '*');
            } else {
                // Open in new tab
                window.open(videoUrl, '_blank');
            }
        },

        // Get current state
        getState: function() {
            return { ...this.state };
        },

        // Debug helpers
        debug: {
            unlockAll: function() {
                window.VR_API.state.unlocked = {
                    quiz: true,
                    video: true,
                    flashcards: true
                };
                window.VR_API.unlockQuiz();
                console.log('All content unlocked for debugging');
            },

            setProgress: function(percent) {
                window.VR_API.onVideoProgress(percent);
            },

            completeTopic: function() {
                window.VR_API.markTopicComplete();
            }
        }
    };

    // Listen for messages from video player
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'VIDEO_PROGRESS') {
            window.VR_API.onVideoProgress(event.data.progress);
        }
    });

    // Enhanced video panel click handler
    document.addEventListener('DOMContentLoaded', function() {
        // Add click handler to video panel for opening video
        const videoPanel = document.getElementById('videoPanel');
        if (videoPanel) {
            videoPanel.addEventListener('click', function(e) {
                if (e.target === this || e.target.id === 'video-content') {
                    window.VR_API.openVideo();
                }
            });
        }
    });

    console.log('VR API initialized');
})();