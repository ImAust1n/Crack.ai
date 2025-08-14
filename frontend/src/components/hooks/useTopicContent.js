import { useEffect, useState, useMemo } from 'react';

// Shared hook to fetch image/text for a topic
export function useTopicContent(subjectId, topicId) {
  const storageKey = useMemo(() => {
    if (!topicId) return undefined;
    const subj = subjectId || 'unknown-subject';
    return `topicContentCache:${subj}:${topicId}`;
  }, [subjectId, topicId]);

  // Load any cached values first for instant UI and offline fallback
  const [topicImage, setTopicImage] = useState(() => {
    try {
      if (storageKey) {
        const cached = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (cached?.topicImage) return cached.topicImage;
      }
    } catch {}
    return 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1280&q=80&auto=format&fit=crop';
  });
  const [topicText, setTopicText] = useState(() => {
    try {
      if (storageKey) {
        const cached = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (cached?.topicText) return cached.topicText;
      }
    } catch {}
    return 'Loading topic information...';
  });

  const searchTerm = useMemo(() => {
    if (!topicId) return undefined;
    try {
      return topicId.replace(/-/g, ' ');
    } catch {
      return topicId;
    }
  }, [topicId]);

  // Helper to persist cache
  const writeCache = (imageVal, textVal) => {
    try {
      if (!storageKey) return;
      const prev = JSON.parse(localStorage.getItem(storageKey) || 'null') || {};
      const next = {
        ...prev,
        topicImage: imageVal ?? prev.topicImage,
        topicText: textVal ?? prev.topicText,
        updatedAt: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  // Vite exposes env vars prefixed with VITE_
  const backendBase = (import.meta?.env?.VITE_BACKEND_URL || 'http://127.0.0.1:5000');

  // Image fetch (requires only topicId)
  useEffect(() => {
    const run = async () => {
      if (!searchTerm) return;
      try {
        const response = await fetch(`${backendBase}/api/image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: searchTerm }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.response && !String(data.response).startsWith('Error:')) {
            setTopicImage(data.response);
            writeCache(data.response, undefined);
          }
        }
      } catch (e) {
        // keep default
        console.warn('useTopicContent: image fetch failed', e);
      }
    };
    run();
  }, [searchTerm, backendBase, storageKey]);

  // Text fetch (requires only topicId)
  useEffect(() => {
    const run = async () => {
      if (!searchTerm) return;
      try {
        const response = await fetch(`${backendBase}/api/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: searchTerm }),
        });
        if (response.ok) {
          const data = await response.json();
          let textContent = data?.response;
          if (typeof textContent === 'string' && textContent.startsWith('{')) {
            try {
              const parsed = JSON.parse(textContent);
              textContent = parsed.response || parsed.text || textContent;
            } catch {}
          }
          if (textContent) {
            const clean = String(textContent).trim();
            setTopicText(clean);
            writeCache(undefined, clean);
          }
        } else {
          setTopicText('Failed to load topic information from server.');
        }
      } catch (e) {
        setTopicText('Error loading topic information. Please try again later.');
      }
    };
    run();
  }, [searchTerm, backendBase, storageKey]);

  const title = useMemo(() => {
    if (!topicId) return 'Topic Information';
    return topicId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }, [topicId]);

  return { topicImage, topicText, title };
}
