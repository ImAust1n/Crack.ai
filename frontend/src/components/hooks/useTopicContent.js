import { useEffect, useState, useMemo } from 'react';

// Shared hook to fetch image/text for a topic
export function useTopicContent(subjectId, topicId) {
  const [topicImage, setTopicImage] = useState(
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1280&q=80&auto=format&fit=crop'
  );
  const [topicText, setTopicText] = useState('Loading topic information...');

  const searchTerm = useMemo(() => {
    if (!topicId) return undefined;
    try {
      return topicId.replace(/-/g, ' ');
    } catch {
      return topicId;
    }
  }, [topicId]);

  // Image fetch (requires only topicId)
  useEffect(() => {
    const run = async () => {
      if (!searchTerm) return;
      try {
        const response = await fetch('http://127.0.0.1:5000/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: searchTerm }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.response && !String(data.response).startsWith('Error:')) {
            setTopicImage(data.response);
          }
        }
      } catch (e) {
        // keep default
        console.warn('useTopicContent: image fetch failed', e);
      }
    };
    run();
  }, [searchTerm]);

  // Text fetch (requires only topicId)
  useEffect(() => {
    const run = async () => {
      if (!searchTerm) return;
      try {
        const response = await fetch('http://127.0.0.1:5000/api/text', {
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
          if (textContent) setTopicText(String(textContent).trim());
        } else {
          setTopicText('Failed to load topic information from server.');
        }
      } catch (e) {
        setTopicText('Error loading topic information. Please try again later.');
      }
    };
    run();
  }, [searchTerm]);

  const title = useMemo(() => {
    if (!topicId) return 'Topic Information';
    return topicId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }, [topicId]);

  return { topicImage, topicText, title };
}
