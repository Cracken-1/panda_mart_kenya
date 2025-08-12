'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

const breakpoints = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
} as const;

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      // Determine breakpoint
      if (width >= breakpoints['4xl']) setBreakpoint('4xl');
      else if (width >= breakpoints['3xl']) setBreakpoint('3xl');
      else if (width >= breakpoints['2xl']) setBreakpoint('2xl');
      else if (width >= breakpoints.xl) setBreakpoint('xl');
      else if (width >= breakpoints.lg) setBreakpoint('lg');
      else if (width >= breakpoints.md) setBreakpoint('md');
      else if (width >= breakpoints.sm) setBreakpoint('sm');
      else setBreakpoint('xs');
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
  const isLargeScreen = breakpoint === '3xl' || breakpoint === '4xl';
  
  const isPortrait = windowSize.height > windowSize.width;
  const isLandscape = windowSize.width > windowSize.height;
  
  const isSmallHeight = windowSize.height < 600;
  const isMediumHeight = windowSize.height >= 600 && windowSize.height < 900;
  const isLargeHeight = windowSize.height >= 900;

  return {
    // Current breakpoint
    breakpoint,
    
    // Window dimensions
    windowSize,
    
    // Device type helpers
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    
    // Orientation helpers
    isPortrait,
    isLandscape,
    
    // Height helpers
    isSmallHeight,
    isMediumHeight,
    isLargeHeight,
    
    // Breakpoint checks
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2Xl: breakpoint === '2xl',
    is3Xl: breakpoint === '3xl',
    is4Xl: breakpoint === '4xl',
    
    // Minimum breakpoint checks
    isSmAndUp: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].includes(breakpoint),
    isMdAndUp: ['md', 'lg', 'xl', '2xl', '3xl', '4xl'].includes(breakpoint),
    isLgAndUp: ['lg', 'xl', '2xl', '3xl', '4xl'].includes(breakpoint),
    isXlAndUp: ['xl', '2xl', '3xl', '4xl'].includes(breakpoint),
    is2XlAndUp: ['2xl', '3xl', '4xl'].includes(breakpoint),
    
    // Utility functions
    getResponsiveValue: <T>(values: Partial<Record<Breakpoint, T>>, fallback: T): T => {
      return values[breakpoint] ?? fallback;
    },
    
    // Container classes based on breakpoint
    getContainerClasses: () => {
      const baseClasses = 'mx-auto';
      const responsiveClasses = {
        xs: 'px-4 max-w-full',
        sm: 'px-4 max-w-full',
        md: 'px-6 max-w-3xl',
        lg: 'px-8 max-w-5xl',
        xl: 'px-8 max-w-6xl',
        '2xl': 'px-8 max-w-7xl',
        '3xl': 'px-12 max-w-[1800px]',
        '4xl': 'px-16 max-w-[2400px]',
      };
      return `${baseClasses} ${responsiveClasses[breakpoint]}`;
    },
    
    // Grid columns based on breakpoint
    getGridCols: (config?: Partial<Record<Breakpoint, number>>) => {
      const defaultConfig = {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        '2xl': 5,
        '3xl': 6,
        '4xl': 8,
      };
      const cols = config?.[breakpoint] ?? defaultConfig[breakpoint];
      return `grid-cols-${cols}`;
    },
  };
}