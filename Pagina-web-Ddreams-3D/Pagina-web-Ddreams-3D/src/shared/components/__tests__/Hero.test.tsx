import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../Hero';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.ComponentProps<'h1'>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.ComponentProps<'p'>) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('next/image', () => ({
  default: ({ alt, ...props }: React.ComponentProps<'img'>) => <div role="img" aria-label={alt} {...props} />,
}));

// Mock custom hooks
jest.mock('@/shared/hooks/useIntersectionAnimation', () => ({
  useIntersectionAnimation: () => ({
    ref: { current: null },
    isVisible: true,
  }),
  useStaggeredItemsAnimation: () => ({
    ref: { current: null },
    visibleItems: [true, true, true],
    isVisible: true,
  }),
  getAnimationClasses: () => 'opacity-100 translate-y-0',
}));

import { jest } from '@jest/globals';

const MockedHero = () => (
  <ThemeProvider>
    <Hero />
  </ThemeProvider>
);

describe('Hero Component', () => {
  it('renders hero section with main heading', () => {
    render(<MockedHero />);
    
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
    expect(headings[0]).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    render(<MockedHero />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders hero images', () => {
    render(<MockedHero />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);

  });

  test('has proper accessibility attributes', () => {
    render(<MockedHero />);
    
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toBeInTheDocument();
  });
});