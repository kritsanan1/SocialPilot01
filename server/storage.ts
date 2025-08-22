import {
  users,
  socialAccounts,
  posts,
  postAnalytics,
  activities,
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
}

export const storage = new DatabaseStorage();
