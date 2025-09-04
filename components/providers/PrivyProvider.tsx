'use client';

import React from 'react';

interface Props { children: React.ReactNode }

// No-op provider to avoid auth deps during component refactor
export function PrivyProvider({ children }: Props) {
  return <>{children}</>;
}
