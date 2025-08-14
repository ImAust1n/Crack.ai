import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Brain } from "lucide-react";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser, setDemoMode } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validation = signInSchema.parse({ email, password });

      // Mock authentication - in demo mode
      const mockUser = {
        id: "demo-user-1",
        email: validation.email,
        name: validation.email.split("@")[0],
        dailyStudyTime: 0,
        preferredFormat: "",
        weakSubject: "",
        confidence: 0,
        vrEnabled: true,
        onboardingCompleted: true
      };

      setUser(mockUser);
      setDemoMode(true);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Brain className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-gradient">Exam AI VR Tutor</h1>
          <p className="text-muted-foreground">Welcome back! Sign in to continue your learning journey.</p>
        </div>

        <Card className="card-bg border-border">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full hero-gradient" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                variant="link"
                className="p-0 text-primary hover:text-primary-hover"
                onClick={() => navigate("/auth/sign-up")}
              >
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
            🎭 Demo Mode Active - Mock authentication enabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;