import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Brain, ArrowRight, ArrowLeft } from "lucide-react";

const TOTAL_STEPS = 4;

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding, setCurrentTopic } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    dailyStudyTime: [2],
    preferredFormat: "",
    weakSubject: "",
    confidence: [3],
    examDate: ""
  });

  if (!user) {
    navigate("/auth/sign-in");
    return null;
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding with AI topic selection
      const selectedTopic = selectTopicBasedOnProfile();
      completeOnboarding({
        dailyStudyTime: formData.dailyStudyTime[0],
        preferredFormat: formData.preferredFormat,
        weakSubject: formData.weakSubject,
        confidence: formData.confidence[0],
        examDate: formData.examDate
      });
      setCurrentTopic(selectedTopic);
      navigate("/learn");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectTopicBasedOnProfile = () => {
    // Simple rule-based topic selection (would be LLM-powered in production)
    const weakSubjectMap: { [key: string]: string } = {
      "Physics": "physics-waves",
      "Chemistry": "chemistry-organic",
      "Biology": "biology-genetics",
      "Mathematics": "math-calculus"
    };
    return weakSubjectMap[formData.weakSubject] || "physics-waves";
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.dailyStudyTime[0] > 0;
      case 2: return formData.preferredFormat !== "";
      case 3: return formData.weakSubject !== "";
      case 4: return formData.confidence[0] > 0;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Daily Study Time</h2>
              <p className="text-muted-foreground">How many hours can you dedicate to studying each day?</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{formData.dailyStudyTime[0]}h</span>
              </div>
              <Slider
                value={formData.dailyStudyTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, dailyStudyTime: value }))}
                max={8}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1h</span>
                <span>8h</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Learning Format</h2>
              <p className="text-muted-foreground">Which format helps you learn best?</p>
            </div>
            <Select value={formData.preferredFormat} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredFormat: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual (Diagrams & Images)</SelectItem>
                <SelectItem value="auditory">Auditory (Videos & Audio)</SelectItem>
                <SelectItem value="kinesthetic">Kinesthetic (Interactive & VR)</SelectItem>
                <SelectItem value="reading">Reading & Writing</SelectItem>
                <SelectItem value="mixed">Mixed Approach</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Challenging Subject</h2>
              <p className="text-muted-foreground">Which subject do you find most challenging?</p>
            </div>
            <Select value={formData.weakSubject} onValueChange={(value) => setFormData(prev => ({ ...prev, weakSubject: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your challenging subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Confidence Level</h2>
              <p className="text-muted-foreground">How confident do you feel about the Exam exam?</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{formData.confidence[0]}/5</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.confidence[0] <= 2 ? "Need more preparation" :
                    formData.confidence[0] <= 3 ? "Moderately confident" :
                      "Very confident"}
                </p>
              </div>
              <Slider
                value={formData.confidence}
                onValueChange={(value) => setFormData(prev => ({ ...prev, confidence: value }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1</span>
                <span>5</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Exam Date (Optional)</Label>
              <Input
                id="examDate"
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <Brain className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-gradient">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Let's personalize your Exam preparation journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Step {currentStep} of {TOTAL_STEPS}</span>
            <span className="text-muted-foreground">{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="w-full bg-muted-bg rounded-full h-2">
            <div
              className="step-indicator h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        <Card className="card-bg border-border">
          <CardHeader>
            <CardTitle>Setup Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col justify-center">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center gap-2 hero-gradient"
          >
            {currentStep === TOTAL_STEPS ? "Complete Setup" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            🧠 AI will recommend topics based on your profile
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;