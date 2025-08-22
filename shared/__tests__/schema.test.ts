
import { insertUserSchema, insertPostSchema } from '../schema';

describe('Schema Validation', () => {
  describe('insertUserSchema', () => {
    it('should validate a valid user object', () => {
      const validUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com'
      };

      const result = insertUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'invalid-email'
      };

      const result = insertUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('insertPostSchema', () => {
    it('should validate a valid post object', () => {
      const validPost = {
        content: 'This is a test post',
        platforms: ['twitter', 'facebook'],
        userId: 'user-123'
      };

      const result = insertPostSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const invalidPost = {
        content: '',
        platforms: ['twitter'],
        userId: 'user-123'
      };

      const result = insertPostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });
  });
});
