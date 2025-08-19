import { db } from "./db";
import { 
  importAchievements, 
  userAchievementProgress, 
  importAccuracyMetrics,
  type InsertImportAchievement,
  type InsertUserAchievementProgress,
  type InsertImportAccuracyMetrics
} from "@shared/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export interface AchievementCriteria {
  type: 'accuracy' | 'volume' | 'streak' | 'speed' | 'quality';
  threshold: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'alltime';
}

export interface ImportPerformance {
  accuracyPercentage: number;
  validRows: number;
  totalRows: number;
  importDuration: number;
  qualityScore: number;
  errorsDetected: any[];
}

// Predefined achievement definitions
const ACHIEVEMENT_DEFINITIONS = [
  {
    type: 'accuracy',
    name: 'Precision Master',
    description: 'Achieve 100% import accuracy',
    iconType: 'crown',
    level: 5,
    pointsAwarded: 500,
    criteria: { type: 'accuracy', threshold: 100 }
  },
  {
    type: 'accuracy',
    name: 'Data Expert',
    description: 'Maintain 95%+ accuracy across 10 imports',
    iconType: 'trophy',
    level: 4,
    pointsAwarded: 300,
    criteria: { type: 'accuracy', threshold: 95 }
  },
  {
    type: 'accuracy',
    name: 'Quality Analyst',
    description: 'Achieve 90%+ accuracy',
    iconType: 'medal',
    level: 3,
    pointsAwarded: 150,
    criteria: { type: 'accuracy', threshold: 90 }
  },
  {
    type: 'volume',
    name: 'Data Titan',
    description: 'Import over 10,000 records in a single session',
    iconType: 'gem',
    level: 5,
    pointsAwarded: 400,
    criteria: { type: 'volume', threshold: 10000 }
  },
  {
    type: 'volume',
    name: 'Bulk Champion',
    description: 'Import over 5,000 records',
    iconType: 'trophy',
    level: 3,
    pointsAwarded: 200,
    criteria: { type: 'volume', threshold: 5000 }
  },
  {
    type: 'streak',
    name: 'Consistency King',
    description: 'Complete 20 consecutive successful imports',
    iconType: 'crown',
    level: 4,
    pointsAwarded: 350,
    criteria: { type: 'streak', threshold: 20 }
  },
  {
    type: 'streak',
    name: 'Reliability Pro',
    description: 'Complete 10 consecutive successful imports',
    iconType: 'medal',
    level: 3,
    pointsAwarded: 200,
    criteria: { type: 'streak', threshold: 10 }
  },
  {
    type: 'speed',
    name: 'Lightning Fast',
    description: 'Complete import in under 30 seconds',
    iconType: 'star',
    level: 4,
    pointsAwarded: 250,
    criteria: { type: 'speed', threshold: 30 }
  },
  {
    type: 'quality',
    name: 'Perfectionist',
    description: 'Achieve quality score of 95+',
    iconType: 'gem',
    level: 4,
    pointsAwarded: 300,
    criteria: { type: 'quality', threshold: 95 }
  }
];

export class AchievementService {
  async initializeUserProgress(userId: string): Promise<void> {
    // Check if user already has progress records
    const existingProgress = await db
      .select()
      .from(userAchievementProgress)
      .where(eq(userAchievementProgress.userId, userId))
      .limit(1);

    if (existingProgress.length === 0) {
      // Create initial progress records for each achievement type
      const achievementTypes = ['accuracy', 'volume', 'streak', 'speed', 'quality'];
      
      for (const type of achievementTypes) {
        await db.insert(userAchievementProgress).values({
          userId,
          achievementType: type,
          currentProgress: 0,
          targetProgress: this.getNextThreshold(type, 1),
          level: 1,
          totalPoints: 0,
        });
      }
    }
  }

  async recordImportMetrics(
    userId: string,
    sessionId: string,
    fileName: string,
    performance: ImportPerformance
  ): Promise<void> {
    // Record the metrics
    const pointsEarned = this.calculatePoints(performance);
    
    await db.insert(importAccuracyMetrics).values({
      userId,
      sessionId,
      fileName,
      totalRows: performance.totalRows,
      validRows: performance.validRows,
      errorRows: performance.totalRows - performance.validRows,
      accuracyPercentage: performance.accuracyPercentage.toString(),
      importDuration: performance.importDuration,
      qualityScore: performance.qualityScore,
      errorsDetected: performance.errorsDetected,
      improvementSuggestions: this.generateImprovementSuggestions(performance),
      pointsEarned,
    });

    // Update user progress and check for achievements
    await this.updateUserProgress(userId, performance);
    await this.checkAndUnlockAchievements(userId);
  }

  private async updateUserProgress(userId: string, performance: ImportPerformance): Promise<void> {
    const userProgress = await db
      .select()
      .from(userAchievementProgress)
      .where(eq(userAchievementProgress.userId, userId));

    for (const progress of userProgress) {
      const updates: Partial<InsertUserAchievementProgress> = {
        lastImportAccuracy: performance.accuracyPercentage.toString(),
        totalImports: progress.totalImports + 1,
        totalRecordsImported: progress.totalRecordsImported + performance.validRows,
        totalPoints: progress.totalPoints + this.calculatePoints(performance),
      };

      // Update best accuracy
      if (performance.accuracyPercentage > parseFloat(progress.bestAccuracy || "0")) {
        updates.bestAccuracy = performance.accuracyPercentage.toString();
      }

      // Update consecutive successful imports
      if (performance.accuracyPercentage >= 90) {
        updates.consecutiveSuccessfulImports = progress.consecutiveSuccessfulImports + 1;
      } else {
        updates.consecutiveSuccessfulImports = 0;
      }

      // Update average import time
      const newAverage = Math.round(
        (progress.averageImportTime * progress.totalImports + performance.importDuration) / 
        (progress.totalImports + 1)
      );
      updates.averageImportTime = newAverage;

      // Update type-specific progress
      switch (progress.achievementType) {
        case 'accuracy':
          updates.currentProgress = Math.round(performance.accuracyPercentage);
          break;
        case 'volume':
          updates.currentProgress = performance.validRows;
          break;
        case 'streak':
          updates.currentProgress = updates.consecutiveSuccessfulImports || 0;
          break;
        case 'speed':
          updates.currentProgress = performance.importDuration;
          break;
        case 'quality':
          updates.currentProgress = performance.qualityScore;
          break;
      }

      await db
        .update(userAchievementProgress)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userAchievementProgress.id, progress.id));
    }
  }

  private async checkAndUnlockAchievements(userId: string): Promise<void> {
    const userProgress = await db
      .select()
      .from(userAchievementProgress)
      .where(eq(userAchievementProgress.userId, userId));

    const existingAchievements = await db
      .select()
      .from(importAchievements)
      .where(eq(importAchievements.userId, userId));

    const existingTypes = new Set(existingAchievements.map(a => `${a.achievementType}-${a.level}`));

    for (const definition of ACHIEVEMENT_DEFINITIONS) {
      const progress = userProgress.find(p => p.achievementType === definition.type);
      if (!progress) continue;

      const achievementKey = `${definition.type}-${definition.level}`;
      if (existingTypes.has(achievementKey)) continue;

      const isUnlocked = this.checkCriteria(progress, definition.criteria as AchievementCriteria);
      
      if (isUnlocked) {
        await db.insert(importAchievements).values({
          userId,
          achievementType: definition.type,
          achievementName: definition.name,
          description: definition.description,
          iconType: definition.iconType,
          level: definition.level,
          pointsAwarded: definition.pointsAwarded,
          criteria: definition.criteria,
        });
      }
    }
  }

  private checkCriteria(progress: any, criteria: AchievementCriteria): boolean {
    switch (criteria.type) {
      case 'accuracy':
        return parseFloat(progress.bestAccuracy || "0") >= criteria.threshold;
      case 'volume':
        return progress.totalRecordsImported >= criteria.threshold;
      case 'streak':
        return progress.consecutiveSuccessfulImports >= criteria.threshold;
      case 'speed':
        return progress.averageImportTime <= criteria.threshold;
      case 'quality':
        return progress.currentProgress >= criteria.threshold;
      default:
        return false;
    }
  }

  private calculatePoints(performance: ImportPerformance): number {
    let points = 0;
    
    // Base points for accuracy
    if (performance.accuracyPercentage >= 100) points += 100;
    else if (performance.accuracyPercentage >= 95) points += 75;
    else if (performance.accuracyPercentage >= 90) points += 50;
    else if (performance.accuracyPercentage >= 80) points += 25;
    
    // Volume bonus
    if (performance.validRows >= 10000) points += 100;
    else if (performance.validRows >= 5000) points += 50;
    else if (performance.validRows >= 1000) points += 25;
    
    // Speed bonus
    if (performance.importDuration <= 30) points += 50;
    else if (performance.importDuration <= 60) points += 25;
    
    // Quality bonus
    if (performance.qualityScore >= 95) points += 50;
    else if (performance.qualityScore >= 90) points += 25;
    
    return points;
  }

  private generateImprovementSuggestions(performance: ImportPerformance): any {
    const suggestions = [];
    
    if (performance.accuracyPercentage < 90) {
      suggestions.push({
        type: 'accuracy',
        message: 'Review column mappings and data formats to improve accuracy',
        priority: 'high'
      });
    }
    
    if (performance.importDuration > 120) {
      suggestions.push({
        type: 'speed',
        message: 'Consider splitting large files into smaller batches for faster processing',
        priority: 'medium'
      });
    }
    
    if (performance.qualityScore < 80) {
      suggestions.push({
        type: 'quality',
        message: 'Validate data before import to improve quality score',
        priority: 'high'
      });
    }
    
    return suggestions;
  }

  private getNextThreshold(type: string, level: number): number {
    const thresholds: Record<string, number[]> = {
      accuracy: [70, 80, 90, 95, 100],
      volume: [100, 500, 1000, 5000, 10000],
      streak: [3, 5, 10, 15, 20],
      speed: [300, 180, 120, 60, 30],
      quality: [60, 70, 80, 90, 95]
    };
    
    return thresholds[type]?.[level - 1] || 100;
  }

  async getUserAchievements(userId: string) {
    const achievements = await db
      .select()
      .from(importAchievements)
      .where(eq(importAchievements.userId, userId))
      .orderBy(desc(importAchievements.unlockedAt));

    const progress = await db
      .select()
      .from(userAchievementProgress)
      .where(eq(userAchievementProgress.userId, userId));

    const recentMetrics = await db
      .select()
      .from(importAccuracyMetrics)
      .where(eq(importAccuracyMetrics.userId, userId))
      .orderBy(desc(importAccuracyMetrics.createdAt))
      .limit(10);

    return {
      achievements,
      progress,
      recentMetrics,
      totalPoints: progress.reduce((sum, p) => sum + p.totalPoints, 0),
      level: this.calculateUserLevel(progress.reduce((sum, p) => sum + p.totalPoints, 0))
    };
  }

  private calculateUserLevel(totalPoints: number): number {
    if (totalPoints >= 5000) return 5; // Diamond
    if (totalPoints >= 2500) return 4; // Platinum
    if (totalPoints >= 1000) return 3; // Gold
    if (totalPoints >= 500) return 2;  // Silver
    return 1; // Bronze
  }
}

export const achievementService = new AchievementService();