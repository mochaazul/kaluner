import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Tombol</Button>);
    const button = screen.getByRole('button', { name: 'Tombol' });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Hapus</Button>);
    const button = screen.getByRole('button', { name: 'Hapus' });
    
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Besar</Button>);
    const button = screen.getByRole('button', { name: 'Besar' });
    
    expect(button).toHaveClass('h-11');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Klik Saya</Button>);
    
    const button = screen.getByRole('button', { name: 'Klik Saya' });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link</a>
      </Button>
    );
    
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('bg-primary');
  });

  it('applies additional className correctly', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: 'Custom' });
    
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-primary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Dinonaktifkan</Button>);
    const button = screen.getByRole('button', { name: 'Dinonaktifkan' });
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });
});
