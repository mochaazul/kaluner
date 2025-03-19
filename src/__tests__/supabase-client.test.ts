import { createClient, createServerClient } from '@/lib/supabase/client';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock the Next.js and Supabase dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
  createServerComponentClient: jest.fn()
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({ get: jest.fn() }))
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should call createClientComponentClient', () => {
      // Setup
      (createClientComponentClient as jest.Mock).mockReturnValue({ from: jest.fn() });

      // Execute
      const client = createClient();

      // Assert
      expect(createClientComponentClient).toHaveBeenCalledTimes(1);
      expect(client).toBeDefined();
    });
  });

  describe('createServerClient', () => {
    it('should call createServerComponentClient with cookies', () => {
      // Setup
      (createServerComponentClient as jest.Mock).mockReturnValue({ from: jest.fn() });

      // Execute
      const client = createServerClient();

      // Assert
      expect(createServerComponentClient).toHaveBeenCalledTimes(1);
      expect(createServerComponentClient).toHaveBeenCalledWith(expect.objectContaining({
        cookies: expect.any(Function)
      }));
      expect(client).toBeDefined();
    });
  });
});
