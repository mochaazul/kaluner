// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Memperluas tipe untuk jest-dom
// Ini memungkinkan TypeScript mengenali matcher seperti toBeInTheDocument()
if (typeof global.expect !== 'undefined') {
  // Type definitions sudah diatur di src/config/jest/jest.d.ts
  console.log('Jest DOM matchers loaded');
}
