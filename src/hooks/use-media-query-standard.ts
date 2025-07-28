import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMediaQuery(query?: string) {
  // Default query for mobile detection
  const mediaQuery = query || `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
  
  const [matches, setMatches] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(mediaQuery);
    
    const onChange = () => {
      setMatches(mql.matches);
      setIsLoading(false);
    };

    // Set initial value
    setMatches(mql.matches);
    setIsLoading(false);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mediaQuery]);

  return { matches, isLoading };
}

// Convenience hooks for common use cases
export function useIsMobile() {
  const { matches } = useMediaQuery();
  return matches;
}

export function useMobileNavigation() {
  const { matches } = useMediaQuery();
  return { isOpen: matches };
}