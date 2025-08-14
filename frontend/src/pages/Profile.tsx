import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Brain, Save, ArrowLeft, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useStore();

  if (!user) {
    navigate("/auth/sign-in");
    return null;
  }

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    dailyStudyTime: [user.dailyStudyTime],
    preferredFormat: user.preferredFormat,
    weakSubject: user.weakSubject,
    confidence: [user.confidence],
    examDate: user.examDate || "",
    vrEnabled: user.vrEnabled
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        dailyStudyTime: formData.dailyStudyTime[0],
        preferredFormat: formData.preferredFormat,
        weakSubject: formData.weakSubject,
        confidence: formData.confidence[0],
        examDate: formData.examDate,
        vrEnabled: formData.vrEnabled
      };

      setUser(updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card-bg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Profile Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="card-bg">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card className="card-bg">
            <CardHeader>
              <CardTitle>Study Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Daily Study Time: {formData.dailyStudyTime[0]} hours</Label>
                  <Slider
                    value={formData.dailyStudyTime}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dailyStudyTime: value }))}
                    max={8}
                    min={1}
                    step={0.5}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Learning Format</Label>
                  <Select
                    value={formData.preferredFormat}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, preferredFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
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

                <div className="space-y-2">
                  <Label>Most Challenging Subject</Label>
                  <Select
                    value={formData.weakSubject}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, weakSubject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Confidence Level: {formData.confidence[0]}/5</Label>
                  <Slider
                    value={formData.confidence}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, confidence: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VR Settings */}
          <Card className="card-bg">
            <CardHeader>
              <CardTitle>VR Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable VR Experience</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow VR mode for immersive learning experiences
                  </p>
                </div>
                <Switch
                  checked={formData.vrEnabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vrEnabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isLoading} className="flex-1 hero-gradient">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
          </div>

          {/* Demo Mode Notice */}
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
              🎭 Demo Mode - Changes are saved locally
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;