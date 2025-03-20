import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth-store';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth store
jest.mock('@/hooks/use-auth-store', () => ({
  useAuthStore: jest.fn(),
}));

describe('Home Page', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should redirect to login page if user is not authenticated', () => {
    // Mock user not authenticated
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: () => false,
      isLoading: false,
    });

    render(<Home />);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });

  it('should not redirect if user is authenticated', () => {
    // Mock user authenticated
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: () => true,
      isLoading: false,
    });

    render(<Home />);
    
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(screen.getByText('Kaluner')).toBeInTheDocument();
  });

  it('should not redirect while authentication is loading', () => {
    // Mock authentication loading
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: () => false,
      isLoading: true,
    });

    render(<Home />);
    
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
