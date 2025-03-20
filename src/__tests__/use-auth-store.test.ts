import { renderHook, act } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/hooks/use-auth-store';
import { User } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('useAuthStore', () => {
  const mockUser: User = {
    id: 'user123',
    app_metadata: {},
    user_metadata: {
      name: 'Test User',
    },
    aud: 'authenticated',
    created_at: '2023-01-01T00:00:00.000Z',
    confirmed_at: '2023-01-01T00:00:00.000Z',
    email: 'test@example.com',
    phone: '',
    role: '',
    updated_at: '2023-01-01T00:00:00.000Z',
    last_sign_in_at: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    act(() => {
      useAuthStore.setState({
        user: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('register', () => {
    it('should register a new user and update state', async () => {
      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({
            data: { user: mockUser, session: { access_token: 'token123' } },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const email = 'test@example.com';
      const password = 'password123';
      const metadata = { name: 'Test User' };

      await act(async () => {
        await result.current.register(email, password, metadata);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email,
        password,
        options: { data: metadata },
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when registering a user', async () => {
      const mockError = { message: 'Email already exists' };
      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({
            data: { user: null, session: null },
            error: mockError,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const email = 'existing@example.com';
      const password = 'password123';

      await act(async () => {
        await result.current.register(email, password);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email,
        password,
        options: { data: undefined },
      });
      expect(result.current.user).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('login', () => {
    it('should log in a user and update state', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({
            data: { user: mockUser, session: { access_token: 'token123' } },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const email = 'test@example.com';
      const password = 'password123';

      await act(async () => {
        await result.current.login(email, password);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when logging in', async () => {
      const mockError = { message: 'Invalid credentials' };
      const mockSupabase = {
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({
            data: { user: null, session: null },
            error: mockError,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const email = 'test@example.com';
      const password = 'wrongpassword';

      await act(async () => {
        await result.current.login(email, password);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(result.current.user).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('logout', () => {
    it('should log out a user and update state', async () => {
      // Set initial state with a logged in user
      act(() => {
        useAuthStore.setState({ user: mockUser });
      });

      const mockSupabase = {
        auth: {
          signOut: jest.fn().mockResolvedValue({
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.current.user).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when logging out', async () => {
      // Set initial state with a logged in user
      act(() => {
        useAuthStore.setState({ user: mockUser });
      });

      const mockError = { message: 'Network error' };
      const mockSupabase = {
        auth: {
          signOut: jest.fn().mockResolvedValue({
            error: mockError,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      // User should still be logged out even if there's an error
      expect(result.current.user).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('resetPassword', () => {
    it('should send a password reset email', async () => {
      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://localhost',
        },
        writable: true,
      });

      const mockSupabase = {
        auth: {
          resetPasswordForEmail: jest.fn().mockResolvedValue({
            data: {},
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const email = 'test@example.com';

      await act(async () => {
        await result.current.resetPassword(email);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email, {
        redirectTo: 'http://localhost/reset-password',
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when sending password reset email', async () => {
      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://localhost',
        },
        writable: true,
      });
      
      const mockError = { message: 'User not found' };
      const mockSupabase = {
        auth: {
          resetPasswordForEmail: jest.fn().mockResolvedValue({
            data: {},
            error: mockError,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const email = 'nonexistent@example.com';

      await act(async () => {
        await result.current.resetPassword(email);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email, {
        redirectTo: 'http://localhost/reset-password',
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      // Set initial state with a logged in user
      act(() => {
        useAuthStore.setState({ user: mockUser });
      });

      const updatedUser = {
        ...mockUser,
        user_metadata: {
          name: 'Updated Name',
        },
      };

      const mockSupabase = {
        auth: {
          updateUser: jest.fn().mockResolvedValue({
            data: { user: updatedUser },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const userData = { name: 'Updated Name' };

      await act(async () => {
        await result.current.updateUser(userData);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result.current.user).toEqual(updatedUser);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when updating user data', async () => {
      // Set initial state with a logged in user
      act(() => {
        useAuthStore.setState({ user: mockUser });
      });

      const mockError = { message: 'Update failed' };
      const mockSupabase = {
        auth: {
          updateUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: mockError,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const userData = { name: 'Updated Name' };

      await act(async () => {
        await result.current.updateUser(userData);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result.current.user).toEqual(mockUser); // Should not change
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('getCurrentUser', () => {
    it('should get the current user and update state', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.getCurrentUser();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when getting current user', async () => {
      const mockError = { message: 'Session expired' };
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: mockError,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.getCurrentUser();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(result.current.user).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      act(() => {
        useAuthStore.setState({ user: mockUser });
      });

      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      act(() => {
        useAuthStore.setState({ user: null });
      });

      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.isAuthenticated()).toBe(false);
    });
  });

  describe('session management', () => {
    it('should store session after login', async () => {
      const mockSession = { 
        access_token: 'token123', 
        refresh_token: 'refresh123', 
        expires_at: 3600,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      };
      const mockSupabase = {
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({
            data: { user: mockUser, session: mockSession },
            error: null,
          }),
          getSession: jest.fn().mockResolvedValue({
            data: { session: mockSession },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const email = 'test@example.com';
      const password = 'password123';

      await act(async () => {
        await result.current.login(email, password);
      });

      expect(result.current.user).toEqual(mockUser);
      
      // Verify session is stored
      await act(async () => {
        await result.current.getSession();
      });
      
      expect(result.current.session).toEqual(mockSession);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should clear session after logout', async () => {
      // Set initial state with a logged in user and session
      const mockSession = { 
        access_token: 'token123', 
        refresh_token: 'refresh123', 
        expires_at: 3600,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      };
      act(() => {
        useAuthStore.setState({ 
          user: mockUser,
          session: mockSession
        });
      });

      const mockSupabase = {
        auth: {
          signOut: jest.fn().mockResolvedValue({
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.current.user).toBe(null);
      expect(result.current.session).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('refresh token', () => {
    it('should refresh session when token expires', async () => {
      const oldSession = { 
        access_token: 'old_token', 
        refresh_token: 'refresh123', 
        expires_at: 0,
        expires_in: 0,
        token_type: 'bearer',
        user: mockUser
      };
      const newSession = { 
        access_token: 'new_token', 
        refresh_token: 'refresh123', 
        expires_at: 3600,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      };
      
      // Set initial state with expired session
      act(() => {
        useAuthStore.setState({ 
          user: mockUser,
          session: oldSession
        });
      });

      const mockSupabase = {
        auth: {
          refreshSession: jest.fn().mockResolvedValue({
            data: { session: newSession, user: mockUser },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.refreshSession();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.refreshSession).toHaveBeenCalled();
      expect(result.current.session).toEqual(newSession);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error when refreshing session', async () => {
      const oldSession = { 
        access_token: 'old_token', 
        refresh_token: 'refresh123', 
        expires_at: 0,
        expires_in: 0,
        token_type: 'bearer',
        user: mockUser
      };
      const mockError = { message: 'Invalid refresh token' };
      
      // Set initial state with expired session
      act(() => {
        useAuthStore.setState({ 
          user: mockUser,
          session: oldSession
        });
      });

      const mockSupabase = {
        auth: {
          refreshSession: jest.fn().mockResolvedValue({
            data: { session: null, user: null },
            error: mockError,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.refreshSession();
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.refreshSession).toHaveBeenCalled();
      expect(result.current.session).toEqual(oldSession); // Session should remain unchanged
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  describe('provider authentication', () => {
    it('should sign in with OAuth provider', async () => {
      const mockSession = { 
        access_token: 'token123', 
        refresh_token: 'refresh123', 
        expires_at: 3600,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      };
      const mockSupabase = {
        auth: {
          signInWithOAuth: jest.fn().mockResolvedValue({
            data: { provider: 'google', url: 'https://oauth.redirect.url' },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      const { result } = renderHook(() => useAuthStore());
      const provider = 'google';

      await act(async () => {
        await result.current.loginWithProvider(provider);
      });

      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider,
        options: { redirectTo: expect.any(String) },
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });
});
