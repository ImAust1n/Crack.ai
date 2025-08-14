import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Learn from "./pages/Learn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VRPreview from "./pages/vr/Preview";
import Quiz from "./pages/Quiz";
import VideoLesson from "./pages/VideoLesson";
import TopicList from "./pages/TopicList";
import QuizResults from "./pages/QuizResults";
import VRTutor from "./pages/VRTutor";
import NotFound from "./pages/NotFound";
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://adityarish.app.n8n.cloud/webhook/a011a4a7-4b48-4fd6-aaf3-7be82315a47f/chat',
      webhookConfig: {
        method: 'POST',
        headers: {}
      },
      target: '#n8n-chat',
      mode: 'window',
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      loadPreviousSession: true,
      metadata: {},
      showWelcomeScreen: false,
      defaultLanguage: 'en',
      initialMessages: [
        'Hi there! 👋',
        'My name is AlagPandey. Let me help you with your queries!'
      ],
      i18n: {
        en: {
          subtitle: "Study Buddy ChatBot for any Query",
          footer: '',
          getStarted: 'New Conversation',
          inputPlaceholder: 'Type your question..',
        },
      },
      enableStreaming: false,
    });

    // Move chat widget up to avoid overlapping bottom-right buttons
    const style = document.createElement('style');
    style.setAttribute('data-n8n-chat-offset', 'true');
    style.innerHTML = `
      /* Try targeting potential widget hosts */
      n8n-chat, n8n-chat-widget, .n8n-chat {
        position: fixed !important;
        bottom: 96px !important; /* lift ~6rem */
        right: 24px !important;
        z-index: 10000 !important;
      }
      /* If widget uses an iframe wrapper */
      .n8n-chat-container, #n8n-chat-container {
        bottom: 96px !important;
        right: 24px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style && style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:subjectId" element={<TopicList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vr/preview" element={<VRPreview />} />
            <Route path="/learn/quiz" element={<Quiz />} />
            <Route path="/learn/:subjectId/:topicId/quiz" element={<Quiz />} />
            <Route path="/learn/:subjectId/:topicId/video" element={<VideoLesson />} />
            <Route path="/quiz/results" element={<QuizResults />} />
            <Route path="/vr/tutor" element={<VRTutor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
