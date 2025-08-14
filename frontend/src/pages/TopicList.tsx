import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";

interface Topic {
  id: string;
  name: string;
  description: string;
}

const TopicList = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!subjectId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/data/${subjectId}.json`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to fetch topics for ${subjectId}`);
        }
        const data = await response.json();
        setTopics(data.topics || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [subjectId]);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleStartLearning = () => {
    if (selectedTopic && subjectId) {
      navigate(`/learn/${subjectId}/${selectedTopic.id}/video`);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center p-8">Loading topics...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{subjectId} Topics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className={`cursor-pointer transition-shadow duration-200 ${
                selectedTopic?.id === topic.id
                  ? 'border-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}>
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{topic.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={handleStartLearning} disabled={!selectedTopic}>
            Start Learning
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TopicList;
