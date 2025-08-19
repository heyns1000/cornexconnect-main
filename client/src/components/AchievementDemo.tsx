import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Trophy, Medal, Star, Zap, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function AchievementDemo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSimulating, setIsSimulating] = useState(false);

  const recordImportMutation = useMutation({
    mutationFn: async (performance: any) => {
      return await apiRequest("/api/achievements/record-import", {
        method: "POST",
        body: JSON.stringify({
          userId: user?.id || "demo-user",
          sessionId: `demo-${Date.now()}`,
          fileName: "demo-import.xlsx",
          performance
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements/user"] });
      toast({
        title: "Import Recorded!",
        description: "Your performance has been tracked and points awarded.",
      });
    }
  });

  const simulateImports = [
    {
      name: "Perfect Import",
      performance: {
        accuracyPercentage: 100,
        validRows: 2500,
        totalRows: 2500,
        importDuration: 45,
        qualityScore: 98,
        errorsDetected: []
      },
      description: "Simulate a flawless import with 100% accuracy"
    },
    {
      name: "High Volume Import", 
      performance: {
        accuracyPercentage: 95,
        validRows: 8000,
        totalRows: 8500,
        importDuration: 180,
        qualityScore: 92,
        errorsDetected: [
          { row: 42, error: "Missing postal code" },
          { row: 156, error: "Invalid phone format" }
        ]
      },
      description: "Simulate importing a large dataset with high accuracy"
    },
    {
      name: "Speed Champion",
      performance: {
        accuracyPercentage: 92,
        validRows: 1200,
        totalRows: 1300,
        importDuration: 25,
        qualityScore: 88,
        errorsDetected: [
          { row: 89, error: "Duplicate entry" }
        ]
      },
      description: "Simulate a super-fast import under 30 seconds"
    },
    {
      name: "Quality Focus",
      performance: {
        accuracyPercentage: 97,
        validRows: 3500,
        totalRows: 3600,
        importDuration: 90,
        qualityScore: 96,
        errorsDetected: []
      },
      description: "Simulate high-quality data processing"
    }
  ];

  const handleSimulateImport = async (importType: any) => {
    setIsSimulating(true);
    
    // Show import progress simulation
    toast({
      title: "🚀 Simulating Import",
      description: `Processing ${importType.name}...`,
    });

    setTimeout(async () => {
      await recordImportMutation.mutateAsync(importType.performance);
      setIsSimulating(false);
      
      // Show achievement notification
      if (importType.performance.accuracyPercentage === 100) {
        setTimeout(() => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: "Precision Master - Achieved 100% accuracy!",
            duration: 5000,
          });
        }, 1000);
      }
      
      if (importType.performance.validRows >= 8000) {
        setTimeout(() => {
          toast({
            title: "💎 Achievement Unlocked!",
            description: "Data Titan - Imported over 8,000 records!",
            duration: 5000,
          });
        }, 1500);
      }
      
      if (importType.performance.importDuration <= 30) {
        setTimeout(() => {
          toast({
            title: "⚡ Achievement Unlocked!",
            description: "Lightning Fast - Completed import in under 30 seconds!",
            duration: 5000,
          });
        }, 2000);
      }
    }, 2000);
  };

  return (
    <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Achievement System Demo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Simulate different import scenarios to see how the gamified achievement system works
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Achievement Points Display */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <div className="text-2xl font-bold text-yellow-600">100+</div>
            <div className="text-xs text-muted-foreground">Accuracy Points</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-xs text-muted-foreground">Volume Bonus</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <div className="text-2xl font-bold text-green-600">25+</div>
            <div className="text-xs text-muted-foreground">Speed Bonus</div>
          </Card>
        </div>

        {/* Simulation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simulateImports.map((importType, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-4 cursor-pointer border-2 hover:border-emerald-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {importType.performance.accuracyPercentage === 100 && <Trophy className="w-5 h-5 text-yellow-500" />}
                    {importType.performance.validRows >= 8000 && <Medal className="w-5 h-5 text-purple-500" />}
                    {importType.performance.importDuration <= 30 && <Zap className="w-5 h-5 text-blue-500" />}
                    {importType.performance.qualityScore >= 95 && <Star className="w-5 h-5 text-emerald-500" />}
                    <h4 className="font-semibold">{importType.name}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {importType.performance.accuracyPercentage}%
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {importType.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div>
                    <span className="text-muted-foreground">Records:</span> {importType.performance.validRows.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span> {importType.performance.importDuration}s
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quality:</span> {importType.performance.qualityScore}/100
                  </div>
                  <div>
                    <span className="text-muted-foreground">Errors:</span> {importType.performance.errorsDetected.length}
                  </div>
                </div>

                <Button 
                  onClick={() => handleSimulateImport(importType)}
                  disabled={isSimulating || recordImportMutation.isPending}
                  className="w-full"
                  size="sm"
                >
                  {isSimulating ? "Simulating..." : "Simulate Import"}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievement Preview */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-200/50">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Potential Achievements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Precision Master (100% accuracy)</span>
            </div>
            <div className="flex items-center gap-2">
              <Medal className="w-4 h-4 text-purple-500" />
              <span>Data Titan (8000+ records)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Lightning Fast (≤30 seconds)</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-500" />
              <span>Perfectionist (95+ quality)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}