// Responsive utility functions and classes

export const breakpoints = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Get current breakpoint
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'lg'; // Default for SSR
  
  const width = window.innerWidth;
  
  if (width >= breakpoints['4xl']) return '4xl';
  if (width >= breakpoints['3xl']) return '3xl';
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

// Check if current screen is mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

// Check if current screen is tablet
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

// Check if current screen is desktop
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= breakpoints.lg;
};

// Responsive container classes
export const containerClasses = {
  xs: 'px-4 max-w-full',
  sm: 'px-4 max-w-full',
  md: 'px-6 max-w-3xl mx-auto',
  lg: 'px-8 max-w-5xl mx-auto',
  xl: 'px-8 max-w-6xl mx-auto',
  '2xl': 'px-8 max-w-7xl mx-auto',
  '3xl': 'px-12 max-w-[1800px] mx-auto',
  '4xl': 'px-16 max-w-[2400px] mx-auto',
};

// Responsive text classes
export const textClasses = {
  xs: {
    h1: 'text-2xl',
    h2: 'text-xl',
    h3: 'text-lg',
    body: 'text-sm',
  },
  sm: {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-xl',
    body: 'text-base',
  },
  md: {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    body: 'text-base',
  },
  lg: {
    h1: 'text-5xl',
    h2: 'text-4xl',
    h3: 'text-3xl',
    body: 'text-lg',
  },
  xl: {
    h1: 'text-6xl',
    h2: 'text-5xl',
    h3: 'text-4xl',
    body: 'text-lg',
  },
  '2xl': {
    h1: 'text-7xl',
    h2: 'text-6xl',
    h3: 'text-5xl',
    body: 'text-xl',
  },
  '3xl': {
    h1: 'text-8xl',
    h2: 'text-7xl',
    h3: 'text-6xl',
    body: 'text-xl',
  },
  '4xl': {
    h1: 'text-9xl',
    h2: 'text-8xl',
    h3: 'text-7xl',
    body: 'text-2xl',
  },
};

// Responsive spacing classes
export const spacingClasses = {
  xs: {
    section: 'py-8',
    container: 'px-4',
    gap: 'gap-4',
  },
  sm: {
    section: 'py-12',
    container: 'px-4',
    gap: 'gap-6',
  },
  md: {
    section: 'py-16',
    container: 'px-6',
    gap: 'gap-8',
  },
  lg: {
    section: 'py-20',
    container: 'px-8',
    gap: 'gap-10',
  },
  xl: {
    section: 'py-24',
    container: 'px-8',
    gap: 'gap-12',
  },
  '2xl': {
    section: 'py-32',
    container: 'px-8',
    gap: 'gap-16',
  },
  '3xl': {
    section: 'py-40',
    container: 'px-12',
    gap: 'gap-20',
  },
  '4xl': {
    section: 'py-48',
    container: 'px-16',
    gap: 'gap-24',
  },
};

// Get responsive classes based on current breakpoint
export const getResponsiveClasses = (type: 'container' | 'text' | 'spacing') => {
  const breakpoint = getCurrentBreakpoint();
  
  switch (type) {
    case 'container':
      return containerClasses[breakpoint];
    case 'text':
      return textClasses[breakpoint];
    case 'spacing':
      return spacingClasses[breakpoint];
    default:
      return '';
  }
};

// Hook for responsive behavior
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      breakpoint: 'lg' as Breakpoint,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    };
  }

  const breakpoint = getCurrentBreakpoint();
  
  return {
    breakpoint,
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
  };
};

// Common responsive component classes
export const responsiveClasses = {
  // Grid layouts
  grid: {
    xs: 'grid-cols-1',
    sm: 'grid-cols-1',
    md: 'grid-cols-2',
    lg: 'grid-cols-3',
    xl: 'grid-cols-4',
    '2xl': 'grid-cols-5',
    '3xl': 'grid-cols-6',
    '4xl': 'grid-cols-8',
  },
  
  // Card layouts
  card: {
    xs: 'p-4 rounded-lg',
    sm: 'p-4 rounded-lg',
    md: 'p-6 rounded-xl',
    lg: 'p-8 rounded-xl',
    xl: 'p-8 rounded-2xl',
    '2xl': 'p-10 rounded-2xl',
    '3xl': 'p-12 rounded-3xl',
    '4xl': 'p-16 rounded-3xl',
  },
  
  // Button sizes
  button: {
    xs: 'px-3 py-2 text-sm',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
    '2xl': 'px-12 py-6 text-2xl',
    '3xl': 'px-16 py-8 text-3xl',
    '4xl': 'px-20 py-10 text-4xl',
  },
  
  // Input sizes
  input: {
    xs: 'px-3 py-2 text-sm',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-4 py-3 text-base',
    xl: 'px-5 py-4 text-lg',
    '2xl': 'px-6 py-5 text-xl',
    '3xl': 'px-8 py-6 text-2xl',
    '4xl': 'px-10 py-8 text-3xl',
  },
};

// Generate responsive class string
export const generateResponsiveClasses = (
  baseClasses: string,
  responsiveMap: Record<Breakpoint, string>
): string => {
  const classes = [baseClasses];
  
  Object.entries(responsiveMap).forEach(([breakpoint, className]) => {
    if (breakpoint === 'xs') {
      classes.push(className);
    } else {
      classes.push(`${breakpoint}:${className}`);
    }
  });
  
  return classes.join(' ');
};