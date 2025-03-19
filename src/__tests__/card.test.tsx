import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card Component', () => {
    it('renders correctly with default props', () => {
      render(<Card data-testid="card">Konten Kartu</Card>);
      const card = screen.getByTestId('card');
      
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-lg border bg-card text-card-foreground shadow-sm');
      expect(card).toHaveTextContent('Konten Kartu');
    });

    it('applies additional className correctly', () => {
      render(<Card className="custom-class" data-testid="card">Konten</Card>);
      const card = screen.getByTestId('card');
      
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('rounded-lg border bg-card');
    });
  });

  describe('CardHeader Component', () => {
    it('renders correctly with default props', () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);
      const header = screen.getByTestId('card-header');
      
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex flex-col space-y-1.5 p-6');
      expect(header).toHaveTextContent('Header');
    });
  });

  describe('CardTitle Component', () => {
    it('renders correctly with default props', () => {
      render(<CardTitle data-testid="card-title">Judul</CardTitle>);
      const title = screen.getByTestId('card-title');
      
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-2xl font-semibold leading-none tracking-tight');
      expect(title).toHaveTextContent('Judul');
    });
  });

  describe('CardDescription Component', () => {
    it('renders correctly with default props', () => {
      render(<CardDescription data-testid="card-desc">Deskripsi</CardDescription>);
      const desc = screen.getByTestId('card-desc');
      
      expect(desc).toBeInTheDocument();
      expect(desc).toHaveClass('text-sm text-muted-foreground');
      expect(desc).toHaveTextContent('Deskripsi');
    });
  });

  describe('CardContent Component', () => {
    it('renders correctly with default props', () => {
      render(<CardContent data-testid="card-content">Konten</CardContent>);
      const content = screen.getByTestId('card-content');
      
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6 pt-0');
      expect(content).toHaveTextContent('Konten');
    });
  });

  describe('CardFooter Component', () => {
    it('renders correctly with default props', () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
      const footer = screen.getByTestId('card-footer');
      
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex items-center p-6 pt-0');
      expect(footer).toHaveTextContent('Footer');
    });
  });

  it('renders a complete card with all components', () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>Judul Kartu</CardTitle>
          <CardDescription>Ini adalah deskripsi kartu</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Ini adalah konten kartu</p>
        </CardContent>
        <CardFooter>
          <p>Footer kartu</p>
        </CardFooter>
      </Card>
    );
    
    const card = screen.getByTestId('full-card');
    expect(card).toBeInTheDocument();
    expect(screen.getByText('Judul Kartu')).toBeInTheDocument();
    expect(screen.getByText('Ini adalah deskripsi kartu')).toBeInTheDocument();
    expect(screen.getByText('Ini adalah konten kartu')).toBeInTheDocument();
    expect(screen.getByText('Footer kartu')).toBeInTheDocument();
  });
});
