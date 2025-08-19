import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Star, Crown, Gem, Target, TrendingUp, Zap, CheckCircle, Award, User, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface Achievement {
  id: string;
  achievementType: string;
  achievementName: string;
  description: string;
  iconType: string;
  level: number;
  pointsAwarded: number;
  unlockedAt: string;
}

interface UserProgress {
  id: string;
  achievementType: string;
  currentProgress: number;
  targetProgress: number;
  level: number;
  totalPoints: number;
  bestAccuracy: string;
  consecutiveSuccessfulImports: number;
  totalImports: number;
  totalRecordsImported: number;
  averageImportTime: number;
}

interface AchievementData {
  achievements: Achievement[];
  progress: UserProgress[];
  totalPoints: number;
  level: number;
  recentMetrics: any[];
}

const getIcon = (iconType: string, className = "w-8 h-8") => {
  switch (iconType) {
    case 'trophy': return <Trophy className={className} />;
    case 'medal': return <Medal className={className} />;
    case 'star': return <Star className={className} />;
    case 'crown': return <Crown className={className} />;
    case 'gem': return <Gem className={className} />;
    default: return <Award className={className} />;
  }
};

const getLevelColor = (level: number) => {
  switch (level) {
    case 1: return "text-amber-600 bg-amber-50"; // Bronze
    case 2: return "text-gray-600 bg-gray-50"; // Silver
    case 3: return "text-yellow-600 bg-yellow-50"; // Gold
    case 4: return "text-purple-600 bg-purple-50"; // Platinum
    case 5: return "text-blue-600 bg-blue-50"; // Diamond
    default: return "text-gray-600 bg-gray-50";
  }
};

const getLevelName = (level: number) => {
  const levels = ["", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];
  return levels[level] || "Bronze";
};

export function AchievementSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<"overview" | "achievements" | "progress">("overview");

  const { data: achievementData, isLoading } = useQuery<AchievementData>({
    queryKey: ["/api/achievements/user", user?.id],
    enabled: !!user?.id,
  });

  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (achievementData?.achievements) {
      // Check for new achievements (simulated - in real app this would come from server)
      const recent = achievementData.achievements.filter(
        a => new Date(a.unlockedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
      );
      if (recent.length > 0) {
        setNewAchievements(recent);
      }
    }
  }, [achievementData]);

  const showAchievementNotification = (achievement: Achievement) => {
    toast({
      title: "🎉 Achievement Unlocked!",
      description: `${achievement.achievementName}: ${achievement.description}`,
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!achievementData) {
    return (
      <Card className="p-8 text-center">
        <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Achievement Data</h3>
        <p className="text-muted-foreground">Start importing data to earn achievements!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievement Notifications */}
      <AnimatePresence>
        {newAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-yellow-300">
                {getIcon(achievement.iconType, "w-6 h-6")}
              </div>
              <div>
                <h4 className="font-bold">🎉 Achievement Unlocked!</h4>
                <p className="text-sm">{achievement.achievementName}</p>
                <p className="text-xs opacity-90">+{achievement.pointsAwarded} points</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            🏆 Achievement System
          </h1>
          <p className="text-muted-foreground mt-2">Track your import accuracy and earn rewards</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={`px-4 py-2 text-sm font-bold ${getLevelColor(achievementData.level)}`}>
            {getLevelName(achievementData.level)} Level
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{achievementData.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { key: "overview", label: "Overview", icon: Target },
          { key: "achievements", label: "Achievements", icon: Trophy },
          { key: "progress", label: "Progress", icon: TrendingUp },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={selectedTab === key ? "default" : "ghost"}
            onClick={() => setSelectedTab(key as any)}
            className="flex-1 gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Stats */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Imports:</span>
                <span className="font-bold">{achievementData.progress.reduce((sum, p) => sum + p.totalImports, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Records Imported:</span>
                <span className="font-bold">{achievementData.progress.reduce((sum, p) => sum + p.totalRecordsImported, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Best Accuracy:</span>
                <span className="font-bold text-green-600">
                  {Math.max(...achievementData.progress.map(p => parseFloat(p.bestAccuracy || "0"))).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="font-bold text-orange-600">
                  {Math.max(...achievementData.progress.map(p => p.consecutiveSuccessfulImports))}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {achievementData.achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <div className={`${getLevelColor(achievement.level)} p-2 rounded-full`}>
                        {getIcon(achievement.iconType, "w-4 h-4")}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.achievementName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        +{achievement.pointsAwarded}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {achievementData.level}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getLevelName(achievementData.level)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to next level</span>
                  <span>{achievementData.totalPoints % 1000}/1000</span>
                </div>
                <Progress value={(achievementData.totalPoints % 1000) / 10} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementData.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="backdrop-blur-sm bg-white/10 border border-white/20 hover:border-emerald-300 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full ${getLevelColor(achievement.level)} mb-4 group-hover:scale-110 transition-transform`}>
                    {getIcon(achievement.iconType, "w-8 h-8")}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{achievement.achievementName}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(achievement.level)}>
                      {getLevelName(achievement.level)}
                    </Badge>
                    <div className="text-sm font-bold text-emerald-600">
                      +{achievement.pointsAwarded} pts
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTab === "progress" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievementData.progress.map((progress) => (
            <Card key={progress.id} className="backdrop-blur-sm bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{progress.achievementType} Progress</span>
                  <Badge variant="outline">{progress.totalPoints} pts</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.currentProgress}/{progress.targetProgress}</span>
                  </div>
                  <Progress value={(progress.currentProgress / progress.targetProgress) * 100} className="h-2" />
                </div>
                
                {progress.achievementType === 'accuracy' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Best Accuracy</div>
                      <div className="font-bold text-green-600">{progress.bestAccuracy}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Imports</div>
                      <div className="font-bold">{progress.totalImports}</div>
                    </div>
                  </div>
                )}
                
                {progress.achievementType === 'streak' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Current Streak</div>
                      <div className="font-bold text-orange-600">{progress.consecutiveSuccessfulImports}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Records Imported</div>
                      <div className="font-bold">{progress.totalRecordsImported.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                {progress.achievementType === 'speed' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Avg Import Time</div>
                      <div className="font-bold text-blue-600">{progress.averageImportTime}s</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Imports</div>
                      <div className="font-bold">{progress.totalImports}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}