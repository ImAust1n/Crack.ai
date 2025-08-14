import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  dailyStudyTime: number;
  preferredFormat: string;
  weakSubject: string;
  confidence: number;
  examDate?: string;
  vrEnabled: boolean;
  onboardingCompleted: boolean;
}

interface Progress {
  topicId: string;
  completedSteps: string[];
  currentStep: string;
  accuracy: number;
  timeSpent: number;
  lastAccessed: string;
}

interface AppState {
  user: User | null;
  currentTopic: string | null;
  progress: Progress[];
  isVRMode: boolean;
  demoMode: boolean;
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  setCurrentTopic: (topicId: string) => void;
  updateProgress: (topicId: string, step: string, data?: any) => void;
  toggleVRMode: () => void;
  setDemoMode: (enabled: boolean) => void;
  completeOnboarding: (data: Partial<User>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      currentTopic: null,
      progress: [],
      isVRMode: false,
      demoMode: true, // Default to demo mode
      
      setUser: (user) => set({ user }),
      
      logout: () => set({ user: null, currentTopic: null }),
      
      setCurrentTopic: (topicId) => set({ currentTopic: topicId }),
      
      updateProgress: (topicId, step, data) => set((state) => {
        const existingProgress = state.progress.find(p => p.topicId === topicId);
        if (existingProgress) {
          const updatedProgress = state.progress.map(p => 
            p.topicId === topicId 
              ? { 
                  ...p, 
                  currentStep: step,
                  completedSteps: [...new Set([...p.completedSteps, step])],
                  lastAccessed: new Date().toISOString(),
                  ...(data || {})
                }
              : p
          );
          return { progress: updatedProgress };
        } else {
          return {
            progress: [...state.progress, {
              topicId,
              completedSteps: [step],
              currentStep: step,
              accuracy: data?.accuracy || 0,
              timeSpent: data?.timeSpent || 0,
              lastAccessed: new Date().toISOString()
            }]
          };
        }
      }),
      
      toggleVRMode: () => set((state) => ({ isVRMode: !state.isVRMode })),
      
      setDemoMode: (enabled) => set({ demoMode: enabled }),
      
      completeOnboarding: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data, onboardingCompleted: true } : null
      }))
    }),
    {
      name: 'neet-tutor-storage'
    }
  )
);