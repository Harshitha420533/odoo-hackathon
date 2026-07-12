import { usePathname } from 'next/navigation';
import { PageContextType, getAmbientOpacity } from '@/lib/ambient-config';

/**
 * Determines the current page context based on the pathname
 * Used to control ambient world opacity and intensity
 */
export function usePageContext(): PageContextType {
  const pathname = usePathname();

  // Determine page context based on route
  if (pathname === '/' || pathname === '/home') {
    return 'landing';
  } else if (pathname === '/dashboard') {
    return 'dashboard';
  } else if (
    pathname.includes('/vehicles') ||
    pathname.includes('/drivers') ||
    pathname.includes('/trips') ||
    pathname.includes('/maintenance') ||
    pathname.includes('/fuel') ||
    pathname.includes('/expenses')
  ) {
    return 'crud';
  } else if (pathname.includes('/reports') || pathname.includes('/analytics')) {
    return 'reports';
  } else if (pathname.includes('/settings') || pathname.includes('/profile')) {
    return 'forms';
  }

  // Default to dashboard opacity
  return 'dashboard';
}

/**
 * Gets the appropriate ambient opacity for the current page
 */
export function useAmbientOpacity(): number {
  const pageContext = usePageContext();
  return getAmbientOpacity(pageContext);
}
