import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Sparkles, 
  Palette, 
  Zap, 
  Heart, 
  Coffee, 
  Target, 
  Lightbulb,
  Settings,
  Wand2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodProfile {
  id: string;
  name: string;
  description: string;
  color: string;
  energy: number;
  focus: number;
  creativity: number;
  icon: any;
  transitions: {
    duration: number;
    type: 'spring' | 'tween';
    ease: string;
    stagger: number;
  };
}

const moodProfiles: MoodProfile[] = [
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Fast, dynamic transitions for high-energy work sessions',
    color: '#F59E0B',
    energy: 90,
    focus: 70,
    creativity: 80,
    icon: Zap,
    transitions: {
      duration: 0.3,
      type: 'spring',
      ease: 'easeOut',
      stagger: 0.05
    }
  },
  {
    id: 'focused',
    name: 'Focused',
    description: 'Smooth, minimal transitions for concentrated work',
    color: '#3B82F6',
    energy: 60,
    focus: 95,
    creativity: 50,
    icon: Target,
    transitions: {
      duration: 0.5,
      type: 'tween',
      ease: 'easeInOut',
      stagger: 0.02
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Flowing, artistic transitions that inspire innovation',
    color: '#8B5CF6',
    energy: 75,
    focus: 60,
    creativity: 95,
    icon: Palette,
    transitions: {
      duration: 0.7,
      type: 'spring',
      ease: 'easeInOut',
      stagger: 0.08
    }
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Gentle, relaxing transitions for stress-free navigation',
    color: '#10B981',
    energy: 40,
    focus: 80,
    creativity: 70,
    icon: Heart,
    transitions: {
      duration: 0.8,
      type: 'tween',
      ease: 'easeOut',
      stagger: 0.1
    }
  },
  {
    id: 'productive',
    name: 'Productive',
    description: 'Efficient, business-focused transitions for maximum output',
    color: '#EF4444',
    energy: 85,
    focus: 90,
    creativity: 60,
    icon: Coffee,
    transitions: {
      duration: 0.4,
      type: 'spring',
      ease: 'easeInOut',
      stagger: 0.03
    }
  }
];

interface MoodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: string;
  onMoodChange: (mood: MoodProfile) => void;
}

export function MoodSelector({ isOpen, onClose, currentMood, onMoodChange }: MoodSelectorProps) {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const [customSettings, setCustomSettings] = useState({
    energy: 70,
    focus: 70,
    creativity: 70
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const generateAIMood = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/generate-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTime: new Date().toISOString(),
          userActivity: 'business_platform_usage',
          preferences: customSettings
        })
      });

      if (response.ok) {
        const aiMood = await response.json();
        const recommendedProfile = moodProfiles.find(p => p.id === aiMood.recommendedMood) || moodProfiles[0];
        
        setSelectedMood(recommendedProfile.id);
        onMoodChange(recommendedProfile);
        
        toast({
          title: "AI Mood Generated",
          description: `Recommended: ${recommendedProfile.name} - ${aiMood.reasoning}`,
        });
      }
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: "Using default mood profile instead.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleMoodSelect = (mood: MoodProfile) => {
    setSelectedMood(mood.id);
    onMoodChange(mood);
    
    toast({
      title: "Mood Updated",
      description: `Switched to ${mood.name} mode`,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-500" />
                AI-Powered Page Transition Mood Selector
              </CardTitle>
              <CardDescription>
                Customize your workspace experience with intelligent transition patterns that adapt to your workflow
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* AI Generation Section */}
              <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold">AI Mood Generation</h3>
                  </div>
                  <Button 
                    onClick={generateAIMood}
                    disabled={isGeneratingAI}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate AI Mood
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Let AI analyze your current context and recommend the optimal mood profile for your workflow
                </p>
              </div>

              {/* Mood Profiles Grid */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Mood Profiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moodProfiles.map((mood) => {
                    const Icon = mood.icon;
                    const isSelected = selectedMood === mood.id;
                    
                    return (
                      <motion.div
                        key={mood.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => handleMoodSelect(mood)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="p-2 rounded-full"
                            style={{ backgroundColor: `${mood.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: mood.color }} />
                          </div>
                          <div>
                            <h4 className="font-medium">{mood.name}</h4>
                            {isSelected && (
                              <Badge variant="outline" className="text-xs">Active</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {mood.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Energy</span>
                            <span>{mood.energy}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${mood.energy}%`,
                                backgroundColor: mood.color 
                              }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span>Focus</span>
                            <span>{mood.focus}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${mood.focus}%`,
                                backgroundColor: mood.color 
                              }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span>Creativity</span>
                            <span>{mood.creativity}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${mood.creativity}%`,
                                backgroundColor: mood.color 
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Custom Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Energy Level</label>
                    <Slider
                      value={[customSettings.energy]}
                      onValueChange={(value) => setCustomSettings(prev => ({ ...prev, energy: value[0] }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">{customSettings.energy}%</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Focus Level</label>
                    <Slider
                      value={[customSettings.focus]}
                      onValueChange={(value) => setCustomSettings(prev => ({ ...prev, focus: value[0] }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">{customSettings.focus}%</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Creativity Level</label>
                    <Slider
                      value={[customSettings.creativity]}
                      onValueChange={(value) => setCustomSettings(prev => ({ ...prev, creativity: value[0] }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">{customSettings.creativity}%</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onClose} className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                  Apply Mood
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}