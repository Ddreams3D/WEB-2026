import '@testing-library/jest-dom'

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}
window.IntersectionObserver = IntersectionObserver;
global.IntersectionObserver = IntersectionObserver;
