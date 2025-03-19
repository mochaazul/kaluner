import { cn, formatCurrency, formatDate, calculateRecipeCost } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
      expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
      expect(cn('foo', { bar: false }, 'baz')).toBe('foo baz');
    });

    it('should handle Tailwind conflicts correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('formatCurrency function', () => {
    it('should format numbers as IDR currency', () => {
      // Tambahkan console.log untuk debugging
      console.log('formatCurrency(1000):', formatCurrency(1000));
      console.log('formatCurrency(1500000):', formatCurrency(1500000));
      console.log('formatCurrency(0):', formatCurrency(0));
      
      expect(formatCurrency(1000)).toBe('Rp 1.000');
      expect(formatCurrency(1500000)).toBe('Rp 1.500.000');
      expect(formatCurrency(0)).toBe('Rp 0');
    });

    it('should round decimal places to nearest integer', () => {
      // Tambahkan console.log untuk debugging
      console.log('formatCurrency(1000.50):', formatCurrency(1000.50));
      console.log('formatCurrency(1500.75):', formatCurrency(1500.75));
      
      expect(formatCurrency(1000.50)).toBe('Rp 1.001');
      expect(formatCurrency(1500.75)).toBe('Rp 1.501');
    });
  });

  describe('formatDate function', () => {
    it('should format dates in Indonesian format', () => {
      const date = new Date(2023, 0, 15); // January 15, 2023
      expect(formatDate(date)).toBe('15 Januari 2023');
    });

    it('should handle string dates', () => {
      expect(formatDate('2023-01-15')).toBe('15 Januari 2023');
    });
  });

  describe('calculateRecipeCost function', () => {
    it('should calculate the total cost correctly', () => {
      const ingredients = [
        { quantity: 2, cost_per_unit: 5000 },
        { quantity: 1.5, cost_per_unit: 10000 },
        { quantity: 3, cost_per_unit: 2000 }
      ];
      
      // (2 * 5000) + (1.5 * 10000) + (3 * 2000) = 10000 + 15000 + 6000 = 31000
      expect(calculateRecipeCost(ingredients)).toBe(31000);
    });

    it('should return 0 for empty ingredients array', () => {
      expect(calculateRecipeCost([])).toBe(0);
    });
  });
});
