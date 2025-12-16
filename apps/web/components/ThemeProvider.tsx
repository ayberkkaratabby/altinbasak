'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load theme from API on mount
    const loadTheme = async () => {
      try {
        // In production, this would be your actual API endpoint
        // For now, we'll use a local storage fallback or default
        const response = await fetch('/api/theme');
        if (response.ok) {
          const data = await response.json();
          applyTheme(data.colors);
        }
      } catch (error) {
        // Fallback to default or localStorage
        const savedTheme = localStorage.getItem('theme_colors');
        if (savedTheme) {
          try {
            const colors = JSON.parse(savedTheme);
            applyTheme(colors);
          } catch (e) {
            // Use defaults
          }
        }
      }
    };

    loadTheme();
  }, []);

  return <>{children}</>;
}

function applyTheme(colors: {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
}) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-text-muted', colors.textMuted);
  
  // Also save to localStorage for faster loading
  localStorage.setItem('theme_colors', JSON.stringify(colors));
}

