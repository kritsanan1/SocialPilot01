import {
  users,
  socialAccounts,
  posts,
  postAnalytics,
  activities,
  contentAnalysis,
  abTestVariants,
  brandVoiceSettings,
  type User,
  type UpsertUser,
  type SocialAccount,
  type InsertSocialAccount,
  type Post,
  type InsertPost,
  type PostAnalytics,
  type InsertPostAnalytics,
  type Activity,
  type InsertActivity,
  type ContentAnalysis,
  type InsertContentAnalysis,
  type AbTestVariant,
  type InsertAbTestVariant,
  type BrandVoiceSettings,
  type InsertBrandVoiceSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, avg, sum } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Social account operations
  getSocialAccountsByUserId(userId: string): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: string, updates: Partial<InsertSocialAccount>): Promise<SocialAccount>;
  
  // Post operations
  getPostsByUserId(userId: string, limit?: number): Promise<Post[]>;
  getScheduledPostsByUserId(userId: string, limit?: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<InsertPost>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  
  // Analytics operations
  getPostAnalytics(postId: string): Promise<PostAnalytics[]>;
  getEngagementStats(userId: string, days?: number): Promise<any>;
  getPlatformPerformance(userId: string): Promise<any>;
  
  // Activity operations
  getActivitiesByUserId(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // AI Content Analysis operations
  analyzeContent(content: string, userId: string, postId?: string): Promise<ContentAnalysis>;
  getContentAnalysis(postId: string): Promise<ContentAnalysis | undefined>;
  
  // A/B Testing operations
  createAbTestVariant(variant: InsertAbTestVariant): Promise<AbTestVariant>;
  getAbTestVariants(originalPostId: string): Promise<AbTestVariant[]>;
  
  // Brand Voice operations
  getBrandVoiceSettings(userId: string): Promise<BrandVoiceSettings | undefined>;
  upsertBrandVoiceSettings(settings: InsertBrandVoiceSettings): Promise<BrandVoiceSettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Social account operations
  async getSocialAccountsByUserId(userId: string): Promise<SocialAccount[]> {
    return await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.userId, userId))
      .orderBy(desc(socialAccounts.createdAt));
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [newAccount] = await db
      .insert(socialAccounts)
      .values(account)
      .returning();
    return newAccount;
  }

  async updateSocialAccount(id: string, updates: Partial<InsertSocialAccount>): Promise<SocialAccount> {
    const [updatedAccount] = await db
      .update(socialAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialAccounts.id, id))
      .returning();
    return updatedAccount;
  }

  // Post operations
  async getPostsByUserId(userId: string, limit = 10): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(and(eq(posts.userId, userId), eq(posts.status, "published")))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
  }

  async getScheduledPostsByUserId(userId: string, limit = 10): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(and(eq(posts.userId, userId), eq(posts.status, "scheduled")))
      .orderBy(desc(posts.scheduledFor))
      .limit(limit);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Analytics operations
  async getPostAnalytics(postId: string): Promise<PostAnalytics[]> {
    return await db
      .select()
      .from(postAnalytics)
      .where(eq(postAnalytics.postId, postId));
  }

  async getEngagementStats(userId: string, days = 30): Promise<any> {
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId));
    
    const postIds = userPosts.map(post => post.id);
    
    if (postIds.length === 0) {
      return {
        totalReach: 0,
        totalEngagements: 0,
        newFollowers: 0,
        avgClickThroughRate: 0,
      };
    }

    const analytics = await db
      .select({
        totalImpressions: sum(postAnalytics.impressions),
        totalLikes: sum(postAnalytics.likes),
        totalComments: sum(postAnalytics.comments),
        totalShares: sum(postAnalytics.shares),
        totalClicks: sum(postAnalytics.clicks),
        avgEngagementRate: avg(postAnalytics.engagementRate),
      })
      .from(postAnalytics)
      .where(eq(postAnalytics.postId, postIds[0])); // Simplified query

    const stats = analytics[0];
    
    return {
      totalReach: stats.totalImpressions || 0,
      totalEngagements: Number(stats.totalLikes || 0) + Number(stats.totalComments || 0) + Number(stats.totalShares || 0),
      newFollowers: Math.floor(Math.random() * 5000) + 1000, // Mock data
      avgClickThroughRate: stats.avgEngagementRate || 0,
    };
  }

  async getPlatformPerformance(userId: string): Promise<any> {
    const platforms = ['twitter', 'instagram', 'linkedin'];
    const performance = await Promise.all(
      platforms.map(async (platform) => {
        // Mock engagement rates based on platform
        const baseRates = {
          twitter: 8.7,
          instagram: 12.3,
          linkedin: 5.9,
        };
        
        return {
          platform,
          engagementRate: baseRates[platform as keyof typeof baseRates],
        };
      })
    );
    
    return performance;
  }

  // Activity operations
  async getActivitiesByUserId(userId: string, limit = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  // AI Content Analysis operations
  async analyzeContent(content: string, userId: string, postId?: string): Promise<ContentAnalysis> {
    // AI Content Scoring Algorithm
    const engagementScore = this.calculateEngagementScore(content);
    const seoScore = this.calculateSeoScore(content);
    const readabilityScore = this.calculateReadabilityScore(content);
    const brandVoiceScore = await this.calculateBrandVoiceScore(content, userId);
    const sentimentScore = this.calculateSentimentScore(content);
    const overallScore = Math.round((engagementScore + seoScore + readabilityScore + brandVoiceScore) / 4);

    const suggestions = this.generateSuggestions(content, engagementScore, seoScore, readabilityScore, brandVoiceScore);
    const hashtags = this.suggestHashtags(content);
    const bestPostingTimes = this.getBestPostingTimes();

    const [analysis] = await db
      .insert(contentAnalysis)
      .values({
        postId,
        content,
        engagementScore,
        seoScore,
        readabilityScore,
        brandVoiceScore,
        overallScore,
        sentimentScore,
        suggestions: JSON.stringify(suggestions),
        hashtags,
        bestPostingTimes: JSON.stringify(bestPostingTimes),
      })
      .returning();
    
    return analysis;
  }

  async getContentAnalysis(postId: string): Promise<ContentAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(contentAnalysis)
      .where(eq(contentAnalysis.postId, postId));
    return analysis;
  }

  // A/B Testing operations
  async createAbTestVariant(variant: InsertAbTestVariant): Promise<AbTestVariant> {
    const [newVariant] = await db
      .insert(abTestVariants)
      .values(variant)
      .returning();
    return newVariant;
  }

  async getAbTestVariants(originalPostId: string): Promise<AbTestVariant[]> {
    return await db
      .select()
      .from(abTestVariants)
      .where(eq(abTestVariants.originalPostId, originalPostId));
  }

  // Brand Voice operations
  async getBrandVoiceSettings(userId: string): Promise<BrandVoiceSettings | undefined> {
    const [settings] = await db
      .select()
      .from(brandVoiceSettings)
      .where(eq(brandVoiceSettings.userId, userId));
    return settings;
  }

  async upsertBrandVoiceSettings(settings: InsertBrandVoiceSettings): Promise<BrandVoiceSettings> {
    const [upsertedSettings] = await db
      .insert(brandVoiceSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: brandVoiceSettings.userId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSettings;
  }

  // AI Analysis Helper Methods
  private calculateEngagementScore(content: string): number {
    let score = 50; // Base score
    
    // Check for engaging elements
    if (content.includes('?')) score += 10; // Questions engage audience
    if (content.match(/[!]{1,3}/g)) score += 5; // Exclamation points add excitement
    if (content.match(/#\w+/g)) score += 10; // Hashtags increase discoverability
    if (content.includes('@')) score += 5; // Mentions encourage interaction
    if (content.match(/\b(tips|how|guide|secret|amazing|incredible)\b/gi)) score += 15; // Engaging keywords
    
    // Penalize for too long content
    if (content.length > 280) score -= 10;
    if (content.length > 500) score -= 20;
    
    return Math.min(Math.max(score, 0), 100);
  }

  private calculateSeoScore(content: string): number {
    let score = 50;
    
    // Check for SEO best practices
    const hashtags = content.match(/#\w+/g) || [];
    if (hashtags.length >= 2 && hashtags.length <= 5) score += 20;
    if (hashtags.length > 5) score -= 10; // Too many hashtags
    
    // Check for keywords and trending terms
    if (content.match(/\b(trending|viral|breaking|exclusive|new|update)\b/gi)) score += 15;
    
    // Check for clear call-to-action
    if (content.match(/\b(share|like|comment|follow|click|visit|check out)\b/gi)) score += 10;
    
    return Math.min(Math.max(score, 0), 100);
  }

  private calculateReadabilityScore(content: string): number {
    let score = 70; // Base readability score
    
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Optimal sentence length for social media
    if (avgWordsPerSentence <= 15) score += 15;
    else if (avgWordsPerSentence > 20) score -= 20;
    
    // Check for emojis (make content more engaging)
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
    if (emojiCount >= 1 && emojiCount <= 3) score += 10;
    
    return Math.min(Math.max(score, 0), 100);
  }

  private async calculateBrandVoiceScore(content: string, userId: string): Promise<number> {
    const brandSettings = await this.getBrandVoiceSettings(userId);
    if (!brandSettings) return 50; // Default score if no brand settings
    
    let score = 50;
    
    // Check for brand keywords to include
    if (brandSettings.keywordInclude) {
      const includeMatches = brandSettings.keywordInclude.filter(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      score += includeMatches * 10;
    }
    
    // Penalize for brand keywords to avoid
    if (brandSettings.keywordAvoid) {
      const avoidMatches = brandSettings.keywordAvoid.filter(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      score -= avoidMatches * 15;
    }
    
    // Check tone alignment
    const contentLower = content.toLowerCase();
    switch (brandSettings.tone) {
      case 'professional':
        if (contentLower.match(/\b(expertise|professional|solution|strategy)\b/g)) score += 10;
        break;
      case 'casual':
        if (contentLower.match(/\b(hey|awesome|cool|fun)\b/g)) score += 10;
        break;
      case 'friendly':
        if (contentLower.match(/\b(welcome|thanks|appreciate|love)\b/g)) score += 10;
        break;
    }
    
    return Math.min(Math.max(score, 0), 100);
  }

  private calculateSentimentScore(content: string): number {
    const positiveWords = ['great', 'awesome', 'amazing', 'excellent', 'fantastic', 'love', 'best', 'wonderful', 'perfect', 'incredible'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'frustrating', 'annoying'];
    
    const contentLower = content.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (contentLower.includes(word)) score += 10;
    });
    
    negativeWords.forEach(word => {
      if (contentLower.includes(word)) score -= 10;
    });
    
    return Math.min(Math.max(score, -100), 100);
  }

  private generateSuggestions(content: string, engagement: number, seo: number, readability: number, brandVoice: number): string[] {
    const suggestions: string[] = [];
    
    if (engagement < 70) {
      suggestions.push("Add a question to encourage audience engagement");
      suggestions.push("Include relevant hashtags to increase discoverability");
      suggestions.push("Consider adding emojis to make the post more engaging");
    }
    
    if (seo < 70) {
      suggestions.push("Add 2-5 relevant hashtags for better reach");
      suggestions.push("Include a clear call-to-action");
      suggestions.push("Consider using trending keywords");
    }
    
    if (readability < 70) {
      suggestions.push("Break up long sentences for better readability");
      suggestions.push("Add line breaks to improve visual structure");
    }
    
    if (brandVoice < 70) {
      suggestions.push("Align content tone with your brand voice settings");
      suggestions.push("Include brand-specific keywords");
    }
    
    if (content.length > 280) {
      suggestions.push("Consider shortening content for optimal platform performance");
    }
    
    return suggestions;
  }

  private suggestHashtags(content: string): string[] {
    const contentLower = content.toLowerCase();
    const hashtags: string[] = [];
    
    // Industry-specific hashtags
    if (contentLower.match(/\b(marketing|business|strategy)\b/)) {
      hashtags.push('#DigitalMarketing', '#BusinessStrategy', '#Marketing');
    }
    if (contentLower.match(/\b(tech|technology|software|ai)\b/)) {
      hashtags.push('#Tech', '#Innovation', '#AI', '#Software');
    }
    if (contentLower.match(/\b(tips|advice|guide)\b/)) {
      hashtags.push('#Tips', '#ProTip', '#Guide');
    }
    
    // General engagement hashtags
    hashtags.push('#SocialMedia', '#ContentMarketing', '#Engagement');
    
    return hashtags.slice(0, 5); // Limit to 5 suggestions
  }

  private getBestPostingTimes(): any {
    return {
      twitter: { 
        weekdays: ['9:00 AM', '1:00 PM', '3:00 PM'],
        weekends: ['10:00 AM', '2:00 PM']
      },
      instagram: {
        weekdays: ['11:00 AM', '2:00 PM', '5:00 PM'],
        weekends: ['10:00 AM', '1:00 PM']
      },
      linkedin: {
        weekdays: ['8:00 AM', '12:00 PM', '5:00 PM'],
        weekends: ['9:00 AM']
      }
    };
  }
}

export const storage = new DatabaseStorage();
