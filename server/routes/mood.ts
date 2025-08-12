import { Router } from "express";
import { storage } from "../storage";
import { insertUserMoodPreferenceSchema, insertUserMoodHistorySchema, insertAiMoodAnalyticsSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Get user mood preferences with smart filtering
router.get("/preferences/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await storage.getUserMoodPreferences(userId);
    res.json(preferences);
  } catch (error) {
    console.error("Error fetching user mood preferences:", error);
    res.status(500).json({ error: "Failed to fetch mood preferences" });
  }
});

// Get specific mood preference
router.get("/preferences/:userId/:moodId", async (req, res) => {
  try {
    const { userId, moodId } = req.params;
    const preference = await storage.getUserMoodPreference(userId, moodId);
    
    if (!preference) {
      return res.status(404).json({ error: "Mood preference not found" });
    }
    
    res.json(preference);
  } catch (error) {
    console.error("Error fetching mood preference:", error);
    res.status(500).json({ error: "Failed to fetch mood preference" });
  }
});

// Create or update mood preference
router.post("/preferences", async (req, res) => {
  try {
    const data = insertUserMoodPreferenceSchema.parse(req.body);
    
    // Check if preference already exists
    const existing = await storage.getUserMoodPreference(data.userId, data.moodId);
    
    if (existing) {
      // Update existing preference
      const updated = await storage.updateUserMoodPreference(existing.id, data);
      res.json(updated);
    } else {
      // Create new preference
      const created = await storage.createUserMoodPreference(data);
      res.json(created);
    }
  } catch (error) {
    console.error("Error saving mood preference:", error);
    res.status(500).json({ error: "Failed to save mood preference" });
  }
});

// Update mood preference
router.put("/preferences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updated = await storage.updateUserMoodPreference(id, data);
    res.json(updated);
  } catch (error) {
    console.error("Error updating mood preference:", error);
    res.status(500).json({ error: "Failed to update mood preference" });
  }
});

// Delete mood preference
router.delete("/preferences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteUserMoodPreference(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Mood preference not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting mood preference:", error);
    res.status(500).json({ error: "Failed to delete mood preference" });
  }
});

// Get user mood history with smart filtering
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, moodId, startDate, endDate } = req.query;
    
    const filters: any = {};
    
    if (limit) {
      filters.limit = parseInt(limit as string);
    }
    
    if (moodId) {
      filters.moodId = moodId as string;
    }
    
    if (startDate && endDate) {
      filters.timeRange = {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      };
    }
    
    const history = await storage.getUserMoodHistory(userId, filters);
    res.json(history);
  } catch (error) {
    console.error("Error fetching mood history:", error);
    res.status(500).json({ error: "Failed to fetch mood history" });
  }
});

// Create mood history entry
router.post("/history", async (req, res) => {
  try {
    const data = insertUserMoodHistorySchema.parse(req.body);
    
    // Add contextual information
    const enrichedData = {
      ...data,
      timeOfDay: getTimeOfDay(),
      dayOfWeek: getDayOfWeek(),
      timestamp: new Date()
    };
    
    const created = await storage.createUserMoodHistory(enrichedData);
    
    // Update usage statistics
    await storage.updateMoodUsageStats(data.userId, data.moodId);
    
    res.json(created);
  } catch (error) {
    console.error("Error creating mood history:", error);
    res.status(500).json({ error: "Failed to create mood history" });
  }
});

// Get AI mood analytics
router.get("/analytics/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { analysisType } = req.query;
    
    const analytics = await storage.getAiMoodAnalytics(userId, analysisType as string);
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching mood analytics:", error);
    res.status(500).json({ error: "Failed to fetch mood analytics" });
  }
});

// Create AI mood analytics
router.post("/analytics", async (req, res) => {
  try {
    const data = insertAiMoodAnalyticsSchema.parse(req.body);
    const created = await storage.createAiMoodAnalytics(data);
    res.json(created);
  } catch (error) {
    console.error("Error creating mood analytics:", error);
    res.status(500).json({ error: "Failed to create mood analytics" });
  }
});

// Smart user filtering by mood patterns
router.post("/find-users", async (req, res) => {
  try {
    const pattern = req.body;
    
    const validatedPattern = z.object({
      moodId: z.string().optional(),
      timeOfDay: z.string().optional(),
      dayOfWeek: z.string().optional()
    }).parse(pattern);
    
    const users = await storage.findUsersByMoodPattern(validatedPattern);
    res.json(users);
  } catch (error) {
    console.error("Error finding users by mood pattern:", error);
    res.status(500).json({ error: "Failed to find users" });
  }
});

// Update mood usage statistics
router.post("/usage/:userId/:moodId", async (req, res) => {
  try {
    const { userId, moodId } = req.params;
    await storage.updateMoodUsageStats(userId, moodId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating mood usage stats:", error);
    res.status(500).json({ error: "Failed to update usage stats" });
  }
});

// Helper functions
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function getDayOfWeek(): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
}

export default router;