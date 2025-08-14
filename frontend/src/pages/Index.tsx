import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Headset, BarChart3, Users, Zap, Shield } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  // Auto redirect if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized study plans adapted to your learning style and weak areas"
    },
    {
      icon: Headset,
      title: "VR Experience",
      description: "Immersive 180° VR environments for enhanced visual learning"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Detailed insights into your performance and study patterns"
    },
    {
      icon: Users,
      title: "Expert Content",
      description: "Curated by Exam toppers and experienced educators"
    },
    {
      icon: Zap,
      title: "Adaptive Testing",
      description: "Smart quizzes that adjust to your skill level"
    },
    {
      icon: Shield,
      title: "Proven Results",
      description: "Trusted by thousands of successful Exam aspirants"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Local component styles for animations */}
      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes drift {
          0% { transform: translate(0,0) scale(1); opacity: 0.6; }
          50% { transform: translate(10px,-10px) scale(1.05); opacity: 0.8; }
          100% { transform: translate(0,0) scale(1); opacity: 0.6; }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes moveAcross {
          0% { transform: translateX(-12vw) translateY(var(--y, 0)) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateX(112vw) translateY(var(--y, 0)) rotate(360deg); opacity: 0; }
        }
        /* Brain lightning flash every 3 seconds */
        @keyframes brainFlash {
          0%, 88%, 100% { opacity: 0; filter: drop-shadow(0 0 0px rgba(255,255,255,0)); transform: scale(1); }
          2% { opacity: 1; filter: drop-shadow(0 0 36px rgba(255,255,255,0.95)) drop-shadow(0 0 72px rgba(147,51,234,0.9)); transform: scale(1.08); }
          4% { opacity: 0.7; filter: drop-shadow(0 0 28px rgba(255,255,255,0.7)) drop-shadow(0 0 56px rgba(147,51,234,0.7)); transform: scale(1.05); }
          6% { opacity: 1; filter: drop-shadow(0 0 32px rgba(255,255,255,0.9)) drop-shadow(0 0 64px rgba(59,130,246,0.9)); transform: scale(1.06); }
          10% { opacity: 0.25; filter: drop-shadow(0 0 10px rgba(255,255,255,0.35)); transform: scale(1.01); }
        }
        @keyframes boltFlash {
          0%, 88%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9) rotate(-12deg); }
          2% { opacity: 1; transform: translate(-50%, -50%) scale(1.25) rotate(-12deg); }
          4% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.15) rotate(-12deg); }
          6% { opacity: 1; transform: translate(-50%, -50%) scale(1.2) rotate(-12deg); }
          10% { opacity: 0; transform: translate(-50%, -50%) scale(0.95) rotate(-12deg); }
        }
        /* Long diagonal bolt draw animation */
        @keyframes drawBolt {
          0%, 86%, 100% { stroke-dashoffset: var(--bolt-len, 800); opacity: 0; }
          2% { opacity: 1; }
          6% { stroke-dashoffset: 0; opacity: 1; }
          10% { opacity: 0; }
        }
      `}</style>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background layer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(120deg, rgba(59,130,246,0.25), rgba(147,51,234,0.25), rgba(16,185,129,0.25))",
            backgroundSize: "200% 200%",
            animation: "gradientMove 18s ease-in-out infinite",
            filter: "blur(40px)"
          }}
        />

        {/* Soft floating blobs */}
        <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-[drift_16s_ease-in-out_infinite]" aria-hidden />
        <div className="absolute top-20 -right-24 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl animate-[drift_20s_ease-in-out_infinite]" aria-hidden />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl animate-[drift_22s_ease-in-out_infinite]" aria-hidden />

        {/* Subtle particle grid */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.4))"
          }}
        />

        <div className="hero-gradient min-h-screen flex items-center justify-center relative">
          {/* Animated Stationery moving across the page */}
          <div className="absolute inset-0 -z-0 pointer-events-none">
            {/* Row 1 */}
            <span className="absolute text-3xl opacity-70" style={{ top: '12%', left: '-10%', animation: 'moveAcross 22s linear infinite', animationDelay: '0s', ['--y' as any]: '0px' }}>✏️</span>
            <span className="absolute text-3xl opacity-70" style={{ top: '20%', left: '-15%', animation: 'moveAcross 26s linear infinite', animationDelay: '4s', ['--y' as any]: '-6px' }}>📏</span>
            <span className="absolute text-3xl opacity-70" style={{ top: '28%', left: '-12%', animation: 'moveAcross 24s linear infinite', animationDelay: '8s', ['--y' as any]: '8px' }}>📐</span>
            {/* Row 2 */}
            <span className="absolute text-3xl opacity-60" style={{ top: '42%', left: '-18%', animation: 'moveAcross 28s linear infinite', animationDelay: '2s', ['--y' as any]: '-4px' }}>🖊️</span>
            <span className="absolute text-3xl opacity-60" style={{ top: '50%', left: '-14%', animation: 'moveAcross 25s linear infinite', animationDelay: '7s', ['--y' as any]: '5px' }}>📒</span>
            <span className="absolute text-3xl opacity-60" style={{ top: '58%', left: '-16%', animation: 'moveAcross 27s linear infinite', animationDelay: '11s', ['--y' as any]: '-7px' }}>📎</span>
            {/* Row 3 */}
            <span className="absolute text-3xl opacity-50" style={{ top: '70%', left: '-12%', animation: 'moveAcross 30s linear infinite', animationDelay: '3s', ['--y' as any]: '4px' }}>✂️</span>
            <span className="absolute text-3xl opacity-50" style={{ top: '78%', left: '-20%', animation: 'moveAcross 26s linear infinite', animationDelay: '9s', ['--y' as any]: '-5px' }}>📚</span>
            <span className="absolute text-3xl opacity-50" style={{ top: '86%', left: '-10%', animation: 'moveAcross 31s linear infinite', animationDelay: '13s', ['--y' as any]: '6px' }}>🧪</span>
          </div>
          {/* Brain lightning effect layer (every 3s) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
            {/* Glowing brain icon behind heading */}
            <div
              aria-hidden
              className="relative"
              style={{ animation: 'brainFlash 3s infinite', zIndex: 0 }}
            >
              <Brain className="w-56 h-56 text-white/90" />
              {/* Radial glow */}
              <div className="absolute inset-0 -z-10 rounded-full" style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 70%)',
                filter: 'blur(18px)'
              }} />
            </div>
            {/* Long diagonal lightning bolt (drawn every 3s) */}
            <svg
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12"
              width="220"
              height="720"
              viewBox="0 0 220 720"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 18px rgba(250,204,21,0.9)) drop-shadow(0 0 28px rgba(234,179,8,0.7))', zIndex: 2 }}
            >
              <path
                d="M110 -60 L88 40 L132 120 L96 230 L148 340 L114 450 L156 560 L130 640"
                stroke="#fde047"
                strokeWidth="8"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ strokeDasharray: 820, strokeDashoffset: 820, animation: 'drawBolt 3s infinite' }}
              />
            </svg>
            {/* Lightning bolts overlay with slight offsets */}
            <div aria-hidden className="absolute left-1/2 top-1/2" style={{ animation: 'boltFlash 3s infinite', zIndex: 1 }}>
              <Zap className="w-16 h-16 text-yellow-300 drop-shadow-[0_0_16px_rgba(250,204,21,0.95)]" />
            </div>
            <div aria-hidden className="absolute left-[48%] top-[46%] rotate-12" style={{ animation: 'boltFlash 3s infinite', animationDelay: '0.05s', zIndex: 1 }}>
              <Zap className="w-12 h-12 text-yellow-200 drop-shadow-[0_0_12px_rgba(250,204,21,0.85)]" />
            </div>
            <div aria-hidden className="absolute left-[52%] top-[54%] -rotate-6" style={{ animation: 'boltFlash 3s infinite', animationDelay: '0.1s', zIndex: 1 }}>
              <Zap className="w-14 h-14 text-yellow-300 drop-shadow-[0_0_14px_rgba(250,204,21,0.9)]" />
            </div>
          </div>
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm">
                🚀 Launch your NEET preparation journey
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                AI VR Tutor for
                <span className="block bg-clip-text text-white">
                  NEET Success
                </span>
              </h1>
              
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Transform your NEET preparation with AI-powered personalization and immersive VR learning. 
                Experience the future of medical entrance exam preparation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition"
                  onClick={() => navigate("/auth/sign-up")}
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition"
                  onClick={() => navigate("/auth/sign-in")}
                >
                  Sign In
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  No setup required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  VR compatible
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our AI VR Tutor?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets proven pedagogy to deliver the most effective Exam preparation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-bg border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to Transform Your Exam Preparation?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who have already experienced the power of AI-driven learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="hero-gradient px-8 py-4 text-lg font-semibold"
                onClick={() => navigate("/auth/sign-up")}
              >
                Get Started Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg"
                onClick={() => navigate("/auth/sign-in")}
              >
                I Have an Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">Exam AI VR Tutor</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Exam AI VR Tutor. Transforming medical entrance preparation.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
