import type { Express } from "express";
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export function registerAIRoutes(app: Express) {
  // AI Mood Generation Endpoint
  app.post('/api/ai/generate-mood', async (req, res) => {
    try {
      const { currentTime, userActivity, preferences } = req.body;
      
      const prompt = `
You are an AI assistant that helps optimize user experience through intelligent mood detection and recommendation.

Current Context:
- Time: ${currentTime}
- User Activity: ${userActivity}
- Current Preferences: Energy ${preferences.energy}%, Focus ${preferences.focus}%, Creativity ${preferences.creativity}%

Available Mood Profiles:
1. energetic - Fast, dynamic transitions (Energy: 90%, Focus: 70%, Creativity: 80%)
2. focused - Smooth, minimal transitions (Energy: 60%, Focus: 95%, Creativity: 50%)
3. creative - Flowing, artistic transitions (Energy: 75%, Focus: 60%, Creativity: 95%)
4. calm - Gentle, relaxing transitions (Energy: 40%, Focus: 80%, Creativity: 70%)
5. productive - Efficient, business-focused transitions (Energy: 85%, Focus: 90%, Creativity: 60%)

Based on the current context and user preferences, recommend the most suitable mood profile.

Respond with JSON in this exact format:
{
  "recommendedMood": "mood_id",
  "reasoning": "Brief explanation of why this mood is recommended",
  "confidence": 0.85,
  "adaptations": {
    "energy": 75,
    "focus": 80,
    "creativity": 65
  }
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert UX designer and behavioral psychologist who specializes in optimizing digital experiences based on user context and preferences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
        temperature: 0.7
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      
      res.json({
        success: true,
        recommendedMood: aiResponse.recommendedMood || 'focused',
        reasoning: aiResponse.reasoning || 'Default recommendation based on business context',
        confidence: aiResponse.confidence || 0.75,
        adaptations: aiResponse.adaptations || preferences,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI mood generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI mood recommendation',
        fallbackMood: 'focused'
      });
    }
  });

  // AI Productivity Insights
  app.post('/api/ai/productivity-insights', async (req, res) => {
    try {
      const { moodHistory, userActivity, timeSpent } = req.body;

      const prompt = `
Analyze the user's mood and productivity patterns to provide insights and recommendations.

Mood History: ${JSON.stringify(moodHistory)}
User Activity: ${userActivity}
Time Spent: ${timeSpent} minutes

Provide insights about:
1. Most productive mood combinations
2. Optimal transition timing
3. Personalized recommendations

Respond with JSON format containing actionable insights.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a productivity expert and data analyst specializing in user behavior optimization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.6
      });

      const insights = JSON.parse(response.choices[0].message.content || '{}');
      
      res.json({
        success: true,
        insights,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI productivity insights error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate productivity insights'
      });
    }
  });

  // AI Context-Aware Recommendations
  app.post('/api/ai/context-recommendations', async (req, res) => {
    try {
      const { currentPage, timeOfDay, userBehavior } = req.body;

      const prompt = `
Provide context-aware recommendations for page transitions and user experience optimization.

Context:
- Current Page: ${currentPage}
- Time of Day: ${timeOfDay}
- User Behavior: ${JSON.stringify(userBehavior)}

Recommend:
1. Optimal transition styles
2. Color scheme adjustments
3. Animation timing preferences
4. Focus areas for the current context

Respond with JSON containing specific, actionable recommendations.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a UX specialist who creates personalized, context-aware digital experiences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
        temperature: 0.7
      });

      const recommendations = JSON.parse(response.choices[0].message.content || '{}');
      
      res.json({
        success: true,
        recommendations,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI context recommendations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate context recommendations'
      });
    }
  });
}