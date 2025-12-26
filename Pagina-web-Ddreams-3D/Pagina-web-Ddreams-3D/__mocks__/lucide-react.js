// Mock for lucide-react icons
const React = require('react');

const createMockIcon = (name) => {
  const MockIcon = React.forwardRef((props, ref) => {
    return React.createElement('svg', {
      ...props,
      ref,
      'data-testid': name.toLowerCase(),
      'aria-label': name,
      role: 'img'
    }, name);
  });
  MockIcon.displayName = name;
  return MockIcon;
};

module.exports = {
  ChevronLeft: createMockIcon('ChevronLeft'),
  ChevronRight: createMockIcon('ChevronRight'),
  Play: createMockIcon('Play'),
  Pause: createMockIcon('Pause'),
  ArrowRight: createMockIcon('ArrowRight'),
  ArrowLeft: createMockIcon('ArrowLeft'),
  Menu: createMockIcon('Menu'),
  X: createMockIcon('X'),
  Sun: createMockIcon('Sun'),
  Moon: createMockIcon('Moon'),
  Star: createMockIcon('Star'),
  Heart: createMockIcon('Heart'),
  Eye: createMockIcon('Eye'),
  Search: createMockIcon('Search'),
  Filter: createMockIcon('Filter'),
  ShoppingCart: createMockIcon('ShoppingCart'),
  User: createMockIcon('User'),
  Settings: createMockIcon('Settings'),
  Home: createMockIcon('Home'),
  Info: createMockIcon('Info'),
  Check: createMockIcon('Check'),
  AlertCircle: createMockIcon('AlertCircle'),
  ExternalLink: createMockIcon('ExternalLink'),
};