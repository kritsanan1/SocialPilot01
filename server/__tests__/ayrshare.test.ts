
import { AyrshareService } from '../ayrshare';

// Mock the Ayrshare API calls
jest.mock('social-media-api', () => ({
  SocialMediaAPI: jest.fn().mockImplementation(() => ({
    post: jest.fn(),
    deletePost: jest.fn(),
    getProfiles: jest.fn(),
    getAnalytics: jest.fn()
  }))
}));

describe('AyrshareService', () => {
  let ayrshareService: AyrshareService;

  beforeEach(() => {
    ayrshareService = new AyrshareService('test-api-key');
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const mockPostData = {
        post: 'Test post content',
        platforms: ['twitter', 'facebook']
      };

      const mockResponse = {
        id: 'post-123',
        status: 'success'
      };

      // Mock the API response
      (ayrshareService as any).api.post.mockResolvedValue(mockResponse);

      const result = await ayrshareService.createPost(mockPostData);
      
      expect(result).toEqual(mockResponse);
      expect((ayrshareService as any).api.post).toHaveBeenCalledWith(mockPostData);
    });
  });

  describe('schedulePost', () => {
    it('should schedule a post for future publishing', async () => {
      const scheduleDate = new Date();
      scheduleDate.setHours(scheduleDate.getHours() + 2);

      const mockPostData = {
        post: 'Scheduled post content',
        platforms: ['linkedin'],
        scheduleDate: scheduleDate.toISOString()
      };

      const mockResponse = {
        id: 'scheduled-post-456',
        status: 'scheduled'
      };

      (ayrshareService as any).api.post.mockResolvedValue(mockResponse);

      const result = await ayrshareService.schedulePost(mockPostData);
      
      expect(result).toEqual(mockResponse);
    });
  });
});
