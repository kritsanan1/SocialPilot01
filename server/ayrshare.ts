
import SocialMediaAPI from 'social-media-api';

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;

if (!AYRSHARE_API_KEY) {
  console.warn('AYRSHARE_API_KEY not set - Ayrshare features will be disabled');
}

class AyrshareService {
  private client: SocialMediaAPI | null = null;

  constructor() {
    if (AYRSHARE_API_KEY) {
      this.client = new SocialMediaAPI(AYRSHARE_API_KEY);
    }
  }

  // Create a user profile for Business Plan users
  async createUserProfile(title: string) {
    if (!this.client) throw new Error('Ayrshare not configured');
    
    return await this.client.createProfile({ title });
  }

  // Set profile key for multi-user operations
  setProfileKey(profileKey: string) {
    if (!this.client) throw new Error('Ayrshare not configured');
    
    this.client.setProfileKey(profileKey);
    return this;
  }

  // Post to social media platforms
  async createPost(data: {
    post: string;
    platforms: string[];
    mediaUrls?: string[];
    scheduleDate?: string;
    profileKey?: string;
  }) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (data.profileKey) {
      this.client.setProfileKey(data.profileKey);
    }

    return await this.client.post({
      post: data.post,
      platforms: data.platforms,
      mediaUrls: data.mediaUrls,
      scheduleDate: data.scheduleDate,
      shortenLinks: true,
    });
  }

  // Get post analytics
  async getPostAnalytics(id: string, platforms: string[], profileKey?: string) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (profileKey) {
      this.client.setProfileKey(profileKey);
    }

    return await this.client.analyticsPost({ id, platforms });
  }

  // Get social analytics
  async getSocialAnalytics(platforms: string[], profileKey?: string) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (profileKey) {
      this.client.setProfileKey(profileKey);
    }

    return await this.client.analyticsSocial({ platforms });
  }

  // Get user details and connected accounts
  async getUserDetails(profileKey?: string) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (profileKey) {
      this.client.setProfileKey(profileKey);
    }

    return await this.client.user();
  }

  // Get post history
  async getPostHistory(params?: { lastRecords?: number; lastDays?: number; profileKey?: string }) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (params?.profileKey) {
      this.client.setProfileKey(params.profileKey);
    }

    return await this.client.history({
      lastRecords: params?.lastRecords || 10,
      lastDays: params?.lastDays || 30,
    });
  }

  // Delete a post
  async deletePost(id: string, profileKey?: string) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (profileKey) {
      this.client.setProfileKey(profileKey);
    }

    return await this.client.delete({ id });
  }

  // Generate JWT for social linking page
  async generateJWT(domain: string, privateKey: string, profileKey: string) {
    if (!this.client) throw new Error('Ayrshare not configured');

    return await this.client.generateJWT({
      domain,
      privateKey,
      profileKey,
    });
  }

  // Auto-generate hashtags
  async generateHashtags(post: string, profileKey?: string) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (profileKey) {
      this.client.setProfileKey(profileKey);
    }

    return await this.client.autoHashtags({ post });
  }

  // Upload media
  async uploadMedia(file: string, fileName: string, description?: string, profileKey?: string) {
    if (!this.client) throw new Error('Ayrshare not configured');

    if (profileKey) {
      this.client.setProfileKey(profileKey);
    }

    return await this.client.upload({ file, fileName, description });
  }
}

export const ayrshareService = new AyrshareService();
