import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label Component', () => {
  it('renders correctly with default props', () => {
    render(<Label htmlFor="test-input">Nama</Label>);
    const label = screen.getByText('Nama');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-sm font-medium leading-none');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('applies additional className correctly', () => {
    render(<Label className="custom-class" htmlFor="test-input">Email</Label>);
    const label = screen.getByText('Email');
    
    expect(label).toHaveClass('custom-class');
    expect(label).toHaveClass('text-sm font-medium leading-none');
  });

  it('renders with children correctly', () => {
    render(
      <Label htmlFor="test-input">
        <span>Label dengan elemen lain</span>
      </Label>
    );
    
    expect(screen.getByText('Label dengan elemen lain')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref} htmlFor="test-input">Ref Test</Label>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('LABEL');
  });

  it('applies correct styles when used with a form control', () => {
    render(
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" className="peer" disabled />
      </div>
    );
    
    const label = screen.getByText('Email');
    expect(label).toHaveClass('peer-disabled:opacity-70');
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
  });
});
