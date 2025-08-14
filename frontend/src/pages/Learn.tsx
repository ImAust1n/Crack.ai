import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/layouts/MainLayout";

interface Subject {
  id: string;
  name: string;
}

const Learn = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/data/subjects.json', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/learn/${subjectId}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Choose a Subject</h1>
          <p className="text-muted-foreground mt-2">Select a subject to begin your learning journey.</p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-center gap-4 mb-8">
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant='outline'
              size="lg"
              onClick={() => handleSubjectSelect(subject.id)}
            >
              {subject.name}
            </Button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Learn;