import ResponsiveNavbar from 'components/Navbar/index-responsive';
import ResponsiveFooter from 'components/Footer/index-responsive';
import { ReactNode } from 'react';
import React from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
        <ResponsiveNavbar />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
        <ResponsiveFooter />
    </div>
  );
};

export default Layout;
