import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* A common Header or Footer can be added here later */}
      {children}
    </main>
  );
};

export default MainLayout;
