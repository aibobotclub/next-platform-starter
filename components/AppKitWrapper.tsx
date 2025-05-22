'use client';

import { ReactNode } from 'react';

interface AppKitWrapperProps {
  children: ReactNode;
}

export default function AppKitWrapper({ children }: AppKitWrapperProps) {
  return <>{children}</>;
}
