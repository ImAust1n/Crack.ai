import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';

type QuizItem = {
  question: string;
  options: string[];
  answer: string;
};

const Quiz = () => {
  const navigate = useNavigate();
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();

  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // questions state will hold a random selection of up to 5 items

  useEffect(() => {
    const load = async () => {
      if (!subjectId || !topicId) {
        setError('Missing subject or topic.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/data/${subjectId}.json`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load /data/${subjectId}.json`);
        const data = await res.json();
        const arr: QuizItem[] = data?.quizzes?.[topicId] || [];
        const selected = [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(5, arr.length));
        setQuestions(selected);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load quiz';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [subjectId, topicId]);

  const total = useMemo(() => questions.length, [questions]);
  const answeredCount = useMemo(
    () => Object.keys(selected).filter((k) => Number(k) < questions.length).length,
    [selected, questions.length]
  );

  const handleSelect = (qIndex: number, option: string) => {
    setSelected((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    const items = questions.map((q, idx) => {
      const userAnswer = selected[idx];
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        userAnswer: userAnswer ?? null,
        isCorrect: userAnswer === q.answer,
        index: idx + 1
      };
    });
    navigate('/quiz/results', {
      state: {
        subjectId,
        topicId,
        items
      }
    });
  };

  if (!subjectId || !topicId) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 md:p-8 text-center">
          <p className="text-red-500 mb-4">Invalid quiz URL. Please choose a subject and topic again.</p>
          <Button onClick={() => navigate('/learn')}>Back to Learn</Button>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-8 text-center">Loading quiz…</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-8 text-center text-red-500">{error}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">Quiz: {topicId.replace(/-/g, ' ')}</CardTitle>
            <CardDescription className="capitalize">Subject: {subjectId}</CardDescription>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-muted-foreground">No questions found for this topic.</p>
            ) : (
              <div className="space-y-6">
                {questions.map((q, qi) => (
                  <div key={qi} className="p-4 border rounded-md">
                    <div className="font-medium mb-3">{qi + 1}. {q.question}</div>
                    <div className="grid gap-2">
                      {q.options.map((opt, oi) => {
                        const id = `q${qi}_opt${oi}`;
                        const checked = selected[qi] === opt;
                        return (
                          <label key={id} className={`flex items-center gap-2 cursor-pointer ${checked ? 'text-primary font-medium' : ''}`}>
                            <input
                              type="radio"
                              name={`q_${qi}`}
                              value={opt}
                              checked={checked}
                              onChange={() => handleSelect(qi, opt)}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-muted-foreground">Answered: {answeredCount}/{total}</div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate(`/learn/${subjectId}`)}>Back to Topics</Button>
                <Button disabled={total > 0 && answeredCount === 0} onClick={handleSubmit}>Submit Quiz</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Quiz;
