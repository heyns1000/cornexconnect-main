import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MoodProfile {
  id: string;
  name: string;
  description: string;
  color: string;
  energy: number;
  focus: number;
  creativity: number;
  transitions: {
    duration: number;
    type: 'spring' | 'tween';
    ease: string;
    stagger: number;
  };
}

interface MoodContextType {
  currentMood: MoodProfile;
  setMood: (mood: MoodProfile) => void;
  moodHistory: MoodProfile[];
  getTransitionProps: () => any;
  isAdaptiveModeEnabled: boolean;
  toggleAdaptiveMode: () => void;
}

const defaultMood: MoodProfile = {
  id: 'focused',
  name: 'Focused',
  description: 'Smooth, minimal transitions for concentrated work',
  color: '#3B82F6',
  energy: 60,
  focus: 95,
  creativity: 50,
  transitions: {
    duration: 0.5,
    type: 'tween',
    ease: 'easeInOut',
    stagger: 0.02
  }
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodProfile>(defaultMood);
  const [moodHistory, setMoodHistory] = useState<MoodProfile[]>([defaultMood]);
  const [isAdaptiveModeEnabled, setIsAdaptiveModeEnabled] = useState(true);

  // Load mood from localStorage on mount
  useEffect(() => {
    const savedMood = localStorage.getItem('cornex-mood-profile');
    const savedAdaptive = localStorage.getItem('cornex-adaptive-mode');
    
    if (savedMood) {
      try {
        const mood = JSON.parse(savedMood);
        setCurrentMood(mood);
        setMoodHistory([mood]);
      } catch (error) {
        console.error('Failed to load saved mood:', error);
      }
    }
    
    if (savedAdaptive !== null) {
      setIsAdaptiveModeEnabled(savedAdaptive === 'true');
    }
  }, []);

  // AI-powered adaptive mood detection
  useEffect(() => {
    if (!isAdaptiveModeEnabled) return;

    const detectContextualMood = async () => {
      try {
        const timeOfDay = new Date().getHours();
        const dayOfWeek = new Date().getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Simple heuristics for mood adaptation
        let recommendedMood = currentMood;
        
        if (timeOfDay >= 9 && timeOfDay <= 11 && !isWeekend) {
          // Morning focus time
          recommendedMood = {
            ...defaultMood,
            id: 'focused',
            name: 'Morning Focus',
            energy: 80,
            focus: 95,
            creativity: 60
          };
        } else if (timeOfDay >= 14 && timeOfDay <= 16) {
          // Afternoon creative time
          recommendedMood = {
            ...defaultMood,
            id: 'creative',
            name: 'Creative Flow',
            color: '#8B5CF6',
            energy: 75,
            focus: 70,
            creativity: 95,
            transitions: {
              duration: 0.7,
              type: 'spring',
              ease: 'easeInOut',
              stagger: 0.08
            }
          };
        } else if (timeOfDay >= 17 || timeOfDay <= 8) {
          // Evening/early morning calm time
          recommendedMood = {
            ...defaultMood,
            id: 'calm',
            name: 'Evening Calm',
            color: '#10B981',
            energy: 40,
            focus: 80,
            creativity: 70,
            transitions: {
              duration: 0.8,
              type: 'tween',
              ease: 'easeOut',
              stagger: 0.1
            }
          };
        }
        
        // Only update if mood significantly changed
        if (recommendedMood.id !== currentMood.id) {
          setCurrentMood(recommendedMood);
          setMoodHistory(prev => [...prev.slice(-4), recommendedMood]);
        }
      } catch (error) {
        console.error('Adaptive mood detection failed:', error);
      }
    };

    // Check for mood adaptation every 30 minutes
    const interval = setInterval(detectContextualMood, 30 * 60 * 1000);
    detectContextualMood(); // Initial check

    return () => clearInterval(interval);
  }, [isAdaptiveModeEnabled, currentMood.id]);

  const setMood = (mood: MoodProfile) => {
    setCurrentMood(mood);
    setMoodHistory(prev => [...prev.slice(-4), mood]);
    
    // Save to localStorage
    localStorage.setItem('cornex-mood-profile', JSON.stringify(mood));
  };

  const toggleAdaptiveMode = () => {
    const newMode = !isAdaptiveModeEnabled;
    setIsAdaptiveModeEnabled(newMode);
    localStorage.setItem('cornex-adaptive-mode', newMode.toString());
  };

  const getTransitionProps = () => {
    const { transitions } = currentMood;
    
    return {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -20, scale: 0.95 },
      transition: {
        duration: transitions.duration,
        type: transitions.type,
        ease: transitions.ease as any,
        staggerChildren: transitions.stagger
      }
    };
  };

  return (
    <MoodContext.Provider value={{
      currentMood,
      setMood,
      moodHistory,
      getTransitionProps,
      isAdaptiveModeEnabled,
      toggleAdaptiveMode
    }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMoodContext() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    // Return default context if not wrapped in provider
    return {
      currentMood: defaultMood,
      setMood: () => {},
      moodHistory: [defaultMood],
      getTransitionProps: () => ({
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
        transition: { duration: 0.5, type: 'tween', ease: 'easeInOut' }
      }),
      isAdaptiveModeEnabled: false,
      toggleAdaptiveMode: () => {}
    };
  }
  return context;
}