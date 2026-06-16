import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

export const usePerformance = () => {
  useEffect(() => {
    // Collect Web Vitals
    const metrics: Partial<PerformanceMetrics> = {};

    // First Contentful Paint
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcp) {
      metrics.fcp = Math.round(fcp.startTime);
      console.log(`FCP: ${metrics.fcp}ms`);
    }

    // Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const lastEntry = list.getEntries().pop();
      if (lastEntry) {
        metrics.lcp = Math.round(lastEntry.startTime);
        console.log(`LCP: ${metrics.lcp}ms`);
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // Navigation Timing
    const navTiming = performance.getEntriesByType('navigation')[0];
    if (navTiming instanceof PerformanceNavigationTiming) {
      metrics.ttfb = Math.round(navTiming.responseStart - navTiming.fetchStart);
      console.log(`TTFB: ${metrics.ttfb}ms`);
    }

    // Cumulative Layout Shift
    let cls = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue;
        cls += (entry as any).value;
      }
      metrics.cls = Math.round(cls * 1000) / 1000;
      console.log(`CLS: ${metrics.cls}`);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Log all metrics after 10 seconds
    const timeout = setTimeout(() => {
      console.table(metrics);
    }, 10000);

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
      clearTimeout(timeout);
    };
  }, []);
};