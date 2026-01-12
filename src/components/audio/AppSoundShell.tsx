'use client';

import React from 'react';
import AmbientEngine from '@/components/audio/AmbientEngine';
import { SoundProvider } from '@/components/audio/SoundProvider';
import SoundToggle from '@/components/audio/SoundToggle';

class AmbientErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  override state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch() {
    // no-op
  }

  override render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function AppSoundShell({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <AmbientErrorBoundary>
        <AmbientEngine />
      </AmbientErrorBoundary>
      <div className="fixed top-4 right-4 z-[60]">
        <SoundToggle />
      </div>
      {children}
    </SoundProvider>
  );
}
