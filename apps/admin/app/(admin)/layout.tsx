import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { CommandPaletteWrapper } from './components/CommandPaletteWrapper';
import { ToastProvider } from './components/ToastProvider';
import { QuickActions } from './components/QuickActions';
import { ActivityFeed } from './components/ActivityFeed';
import { OnboardingTour } from './components/OnboardingTour';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  
  // Require authentication for all routes in this layout
  if (!session || !session.authenticated) {
    redirect('/admin/login');
  }
  
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader username={session.username} />
          <main className="p-6 lg:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        {/* Command Palette - Global */}
        <CommandPaletteWrapper />
        
        {/* Quick Actions - Floating */}
        <QuickActions />
        
        {/* Activity Feed - Sidebar */}
        <ActivityFeed />
        
        {/* Onboarding Tour */}
        <OnboardingTour />
      </div>
    </ToastProvider>
  );
}
