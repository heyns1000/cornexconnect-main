import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles } from 'lucide-react';
import { MoodSelector } from './MoodSelector';
import { useMoodContext } from '@/hooks/useMoodContext';

export function MoodFloatingButton() {
  const [moodSelectorOpen, setMoodSelectorOpen] = useState(false);
  const { currentMood, setMood } = useMoodContext();

  return (
    <>
      <Button 
        className="fixed bottom-20 right-6 z-50 rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg animate-pulse"
        onClick={() => setMoodSelectorOpen(true)}
        title="AI-Powered Mood Selector"
      >
        <Brain className="w-6 h-6" />
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
      </Button>
      
      <MoodSelector 
        isOpen={moodSelectorOpen}
        onClose={() => setMoodSelectorOpen(false)}
        currentMood={currentMood.id}
        onMoodChange={(mood) => setMood(mood)}
      />
    </>
  );
}