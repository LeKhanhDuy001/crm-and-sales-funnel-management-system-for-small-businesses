'use client';

import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AppShell({
  children,
  title,
  description,
}: AppShellProps) {
  return (
    <div className="space-y-6">
      {(title || description) && (
        <header>
          {title && (
            <h1 className="text-2xl font-semibold">
              {title}
            </h1>
          )}

          {description && (
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          )}
        </header>
      )}

      {children}
    </div>
  );
}