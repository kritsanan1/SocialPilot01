import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPostSchema, insertSocialAccountSchema, insertActivitySchema, insertContentAnalysisSchema, insertBrandVoiceSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { ayrshareService } from "./ayrshare";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Social accounts routes
  app.get('/api/social-accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accounts = await storage.getSocialAccountsByUserId(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      res.status(500).json({ message: "Failed to fetch social accounts" });
    }
  });

  app.post('/api/social-accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accountData = insertSocialAccountSchema.parse({
        ...req.body,
        userId,
      });
      const account = await storage.createSocialAccount(accountData);
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid account data", errors: error.errors });
      } else {
        console.error("Error creating social account:", error);
        res.status(500).json({ message: "Failed to create social account" });
      }
    }
  });

  // Posts routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getPostsByUserId(userId, 10);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/scheduled', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getScheduledPostsByUserId(userId, 10);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({
        ...req.body,
        userId,
      });
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid post data", errors: error.errors });
      } else {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post" });
      }
    }
  });

  app.put('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const postId = req.params.id;
      const updates = req.body;
      const post = await storage.updatePost(postId, updates);
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const postId = req.params.id;
      await storage.deletePost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/engagement', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getEngagementStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching engagement stats:", error);
      res.status(500).json({ message: "Failed to fetch engagement stats" });
    }
  });

  app.get('/api/analytics/platform-performance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const performance = await storage.getPlatformPerformance(userId);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching platform performance:", error);
      res.status(500).json({ message: "Failed to fetch platform performance" });
    }
  });

  // Activities routes
  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activities = await storage.getActivitiesByUserId(userId, 10);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activityData = insertActivitySchema.parse({
        ...req.body,
        userId,
      });
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      } else {
        console.error("Error creating activity:", error);
        res.status(500).json({ message: "Failed to create activity" });
      }
    }
  });

  // AI Content Analysis routes
  app.post('/api/content/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { content, postId } = req.body;

      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Content is required" });
      }

      const analysis = await storage.analyzeContent(content, userId, postId);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing content:", error);
      res.status(500).json({ message: "Failed to analyze content" });
    }
  });

  app.get('/api/content/analysis/:postId', isAuthenticated, async (req: any, res) => {
    try {
      const postId = req.params.postId;
      const analysis = await storage.getContentAnalysis(postId);

      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Error fetching content analysis:", error);
      res.status(500).json({ message: "Failed to fetch content analysis" });
    }
  });

  // A/B Testing routes
  app.post('/api/ab-test/variants', isAuthenticated, async (req: any, res) => {
    try {
      const variantData = req.body;
      const variant = await storage.createAbTestVariant(variantData);
      res.json(variant);
    } catch (error) {
      console.error("Error creating A/B test variant:", error);
      res.status(500).json({ message: "Failed to create A/B test variant" });
    }
  });

  app.get('/api/ab-test/variants/:postId', isAuthenticated, async (req: any, res) => {
    try {
      const postId = req.params.postId;
      const variants = await storage.getAbTestVariants(postId);
      res.json(variants);
    } catch (error) {
      console.error("Error fetching A/B test variants:", error);
      res.status(500).json({ message: "Failed to fetch A/B test variants" });
    }
  });

  // Brand Voice Settings routes
  app.get('/api/brand-voice', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getBrandVoiceSettings(userId);

      if (!settings) {
        // Return default settings if none exist
        return res.json({
          tone: 'professional',
          voice: 'formal',
          keywordInclude: [],
          keywordAvoid: [],
          industryType: null,
          targetAudience: null,
          brandGuidelines: null
        });
      }

      res.json(settings);
    } catch (error) {
      console.error("Error fetching brand voice settings:", error);
      res.status(500).json({ message: "Failed to fetch brand voice settings" });
    }
  });

  app.post('/api/brand-voice', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = insertBrandVoiceSettingsSchema.parse({
        ...req.body,
        userId,
      });
      const settings = await storage.upsertBrandVoiceSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid brand voice settings", errors: error.errors });
      } else {
        console.error("Error saving brand voice settings:", error);
        res.status(500).json({ message: "Failed to save brand voice settings" });
      }
    }
  });

  // Ayrshare analytics routes
  app.get('/api/analytics/social', isAuthenticated, async (req: any, res) => {
    try {
      const { platforms } = req.query;
      const platformArray = platforms ? platforms.split(',') : ['twitter', 'instagram', 'linkedin'];

      const analytics = await ayrshareService.getSocialAnalytics(platformArray);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching social analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post('/api/analytics/post', isAuthenticated, async (req: any, res) => {
    try {
      const { id, platforms } = req.body;
      const analytics = await ayrshareService.getPostAnalytics(id, platforms);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching post analytics:", error);
      res.status(500).json({ message: "Failed to fetch post analytics" });
    }
  });

  // Auto-generate hashtags
  app.post('/api/hashtags/generate', isAuthenticated, async (req: any, res) => {
    try {
      const { content } = req.body;
      const hashtags = await ayrshareService.generateHashtags(content);
      res.json(hashtags);
    } catch (error) {
      console.error("Error generating hashtags:", error);
      res.status(500).json({ message: "Failed to generate hashtags" });
    }
  });

  // Get connected social accounts via Ayrshare
  app.get('/api/ayrshare/user', isAuthenticated, async (req: any, res) => {
    try {
      const userDetails = await ayrshareService.getUserDetails();
      res.json(userDetails);
    } catch (error) {
      console.error("Error fetching Ayrshare user details:", error);
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });

  // Create Ayrshare user profile (Business Plan)
  app.post('/api/ayrshare/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title } = req.body;
      const profile = await ayrshareService.createUserProfile(title || `Profile for ${userId}`);
      res.json(profile);
    } catch (error) {
      console.error("Error creating Ayrshare profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  const httpServer = createServer(app);
  return httpServer;
}