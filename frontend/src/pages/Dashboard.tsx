import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Clock, Target, TrendingUp, Headset, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, currentTopic, isVRMode, toggleVRMode } = useStore();
  const [subjectProgress, setSubjectProgress] = useState<Array<{
    subject: string;
    subjectId: string;
    topicsAttempted: number;
    totalTopics: number;
    avgScore: number | null;
    percent: number;
  }>>([]);

  // Load subject progress from localStorage quiz data
  useEffect(() => {
    const loadSubjectProgress = async () => {
      const subjects = [
        { id: 'physics', name: 'Physics' },
        { id: 'chemistry', name: 'Chemistry' },
        { id: 'biology', name: 'Biology' }
      ];
      
      const progressData = await Promise.all(
        subjects.map(async (subject) => {
          try {
            // Fetch topics for this subject
            const response = await fetch(`/data/${subject.id}.json`);
            if (!response.ok) return null;
            const data = await response.json();
            const topics = data.topics || [];
            
            // Check localStorage for quiz attempts
            const quizScores: number[] = [];
            const attemptedTopics = new Set<string>();
            
            topics.forEach((topic: { id: string; name: string }) => {
              const storageKey = `quiz:lastScore:${subject.id}:${topic.id}`;
              try {
                const score = localStorage.getItem(storageKey);
                if (score !== null) {
                  quizScores.push(Number(score));
                  attemptedTopics.add(topic.id);
                }
              } catch (e) {
                console.debug('Error reading quiz score:', e);
              }
            });
            
            const avgScore = quizScores.length > 0 
              ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
              : null;
            
            return {
              subject: subject.name,
              subjectId: subject.id,
              topicsAttempted: attemptedTopics.size,
              totalTopics: topics.length,
              avgScore,
              percent: topics.length > 0 ? Math.round((attemptedTopics.size / topics.length) * 100) : 0
            };
          } catch (error) {
            console.error(`Error loading ${subject.name} progress:`, error);
            return null;
          }
        })
      );
      
      setSubjectProgress(progressData.filter(Boolean) as typeof subjectProgress);
    };
    
    loadSubjectProgress();
  }, []);

  // Compute overall stats from quiz data
  const totalQuizzesTaken = subjectProgress.reduce((acc, s) => acc + s.topicsAttempted, 0);
  const overallAvgScore = subjectProgress.length > 0 
    ? Math.round(subjectProgress.reduce((acc, s) => acc + (s.avgScore || 0), 0) / subjectProgress.filter(s => s.avgScore !== null).length)
    : 0;
  const totalTopicsAvailable = subjectProgress.reduce((acc, s) => acc + s.totalTopics, 0);
  const overallProgress = totalTopicsAvailable > 0 
    ? Math.round((totalQuizzesTaken / totalTopicsAvailable) * 100)
    : 0;

  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 2.8 },
    { day: 'Fri', hours: 3.2 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 2.0 }
  ];

  const pieData = subjectProgress.map(s => ({
    name: s.subject,
    value: s.topicsAttempted,
    total: s.totalTopics
  }));

  const COLORS = ['#7C659C', '#A191C1', '#8D78AF', '#675582'];

  if (!user) {
    navigate("/auth/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card-bg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Exam AI VR Tutor</h1>
                <p className="text-sm text-muted-foreground">Dashboard Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVRMode}
                className={isVRMode ? "bg-primary text-primary-foreground" : ""}
              >
                <Headset className="h-4 w-4 mr-2" />
                {isVRMode ? "Exit VR" : "VR Mode"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Here's your learning progress and performance insights.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-bg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                    <p className="text-2xl font-bold">{totalQuizzesTaken}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-bg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Clock className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-2xl font-bold">{overallProgress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-bg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold">{overallAvgScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-bg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <TrendingUp className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                    <p className="text-2xl font-bold">{subjectProgress.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-bg">
              <CardHeader>
                <CardTitle>Weekly Study Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#7C659C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-bg">
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, total }) => `${name}: ${value}/${total}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          {/* Detailed Per-Subject Progress */}
          <Card className="card-bg">
            <CardHeader>
              <CardTitle>Progress by Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectProgress.length === 0 ? (
                <p className="text-muted-foreground">No quizzes taken yet. Start a quiz to see your subject progress.</p>
              ) : (
                subjectProgress.map((s) => (
                  <div key={s.subjectId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{s.subject}</div>
                      <div className="flex items-center gap-2">
                        {s.avgScore !== null && (
                          <Badge variant="outline">Avg score: {s.avgScore}%</Badge>
                        )}
                        <Badge variant="outline">{s.topicsAttempted}/{s.totalTopics} topics</Badge>
                      </div>
                    </div>
                    <Progress value={s.percent} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">{s.percent}%</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Current Topic & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-bg">
              <CardHeader>
                <CardTitle>Current Topic</CardTitle>
              </CardHeader>
              <CardContent>
                {currentTopic ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Continue Learning</h3>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <Button onClick={() => navigate("/learn")} className="w-full hero-gradient">
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">No active topic. Go to Learn to pick a topic and get started.</p>
                    <Button onClick={() => navigate("/learn")} variant="outline">
                      Browse Topics
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-bg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/learn")}
                  disabled={!currentTopic}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Resume Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;