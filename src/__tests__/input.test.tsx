import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Masukkan teks" />);
    const input = screen.getByPlaceholderText('Masukkan teks');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-10 w-full rounded-md border');
  });

  it('applies additional className correctly', () => {
    render(<Input className="custom-class" placeholder="Teks" />);
    const input = screen.getByPlaceholderText('Teks');
    
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveClass('flex h-10 w-full rounded-md border');
  });

  it('handles different input types', () => {
    render(<Input type="number" placeholder="Angka" />);
    const input = screen.getByPlaceholderText('Angka');
    
    expect(input).toHaveAttribute('type', 'number');
  });

  it('handles user input correctly', async () => {
    render(<Input placeholder="Ketik di sini" />);
    const input = screen.getByPlaceholderText('Ketik di sini');
    
    await userEvent.type(input, 'Hello, World!');
    
    expect(input).toHaveValue('Hello, World!');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Dinonaktifkan" />);
    const input = screen.getByPlaceholderText('Dinonaktifkan');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('handles required attribute correctly', () => {
    render(<Input required placeholder="Wajib" />);
    const input = screen.getByPlaceholderText('Wajib');
    
    expect(input).toHaveAttribute('required');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref Test" />);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });
});
