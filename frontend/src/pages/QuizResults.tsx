import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as {
    subjectId?: string;
    topicId?: string;
    items?: Array<{
      index: number;
      question: string;
      options: string[];
      correctAnswer: string;
      userAnswer: string | null;
      isCorrect: boolean;
    }>;
  };

  const items = useMemo(() => state.items ?? [], [state.items]);
  const subjectId = state.subjectId;
  const topicId = state.topicId;

  const correctAnswers = useMemo(() => items.filter(i => i.isCorrect).length, [items]);
  const totalQuestions = items.length;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Track last score per subject/topic
  const storageKey = useMemo(
    () => `quiz:lastScore:${subjectId ?? 'any'}:${topicId ?? 'any'}`,
    [subjectId, topicId]
  );
  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null);

  // Read last score once (before writing current score)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw != null) setLastQuizScore(Number(raw));
    } catch (err) {
      console.warn('Failed to read last quiz score from storage', err);
    }
  }, [storageKey]);

  // Persist current score for next time
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(score));
    } catch (err) {
      console.warn('Failed to write last quiz score to storage', err);
    }
  }, [score, storageKey]);

  const performanceData = [
    { name: 'Last Quiz', score: lastQuizScore ?? 0 },
    { name: 'Current Quiz', score: score },
  ];

  const breakdownData = [
    { name: 'Performance', Correct: score, Incorrect: 100 - score }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Your Progress Report</CardTitle>
            <CardDescription>
              {subjectId && topicId ? (
                <span className="capitalize">{subjectId} • {topicId.replace(/-/g, ' ')}</span>
              ) : (
                'Quiz summary'
              )}
              {` • Score: ${score}%`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="h-64">
                <h3 className="text-xl font-semibold mb-2 text-center">Performance Trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <h3 className="text-xl font-semibold mb-2 text-center">Current Quiz Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdownData} layout="vertical" stackOffset="expand">
                    <XAxis hide type="number" />
                    <YAxis hide type="category" dataKey="name" />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="Correct" fill="#22c55e" stackId="a" />
                    <Bar dataKey="Incorrect" fill="#ef4444" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Detailed Review</h3>
            {items.length === 0 ? (
              <p className="text-muted-foreground mb-4">No detailed data found. Please take a quiz first.</p>
            ) : (
              <div className="space-y-4">
                {items.map((it) => {
                  const isCorrect = it.isCorrect;
                  return (
                    <div key={it.index} className={`p-4 rounded-md border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{it.index}. {it.question}</p>
                        <span className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                      </div>
                      <div className="text-sm">
                        <p><span className="font-medium">Your answer:</span> {it.userAnswer ?? 'Not answered'}</p>
                        {!isCorrect && (
                          <p><span className="font-medium">Correct answer:</span> {it.correctAnswer}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <Button onClick={() => navigate('/dashboard')}>
                Check Progress
              </Button>
              {items.some(item => !item.isCorrect) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (subjectId && topicId) {
                      navigate('/vr/tutor', { state: { subjectId, topicId } });
                    } else {
                      // Fallback to query params if state not available
                      const qs = new URLSearchParams();
                      if (subjectId) qs.set('subject', subjectId);
                      if (topicId) qs.set('topic', topicId);
                      const url = qs.toString() ? `/vr/tutor?${qs.toString()}` : '/vr/tutor';
                      navigate(url);
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none hover:from-purple-700 hover:to-blue-700"
                >
                  📚 Learn with VR AI Tutor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default QuizResults;
