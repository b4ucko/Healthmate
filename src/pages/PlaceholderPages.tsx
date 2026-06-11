
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Simple animation for these pages without framer-motion dependency
const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <AnimatedPage>
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
          <p className="text-muted-foreground mb-8">
            This page is coming soon! We're working hard to bring you the best content.
          </p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

// These components are not used since we now have dedicated pages for them
export const Blogs = () => <PlaceholderPage title="Health Blogs" />;
export const Careers = () => <PlaceholderPage title="Careers at HealthMate" />;
export const Press = () => <PlaceholderPage title="Press and News" />;
export const Terms = () => <PlaceholderPage title="Terms of Service" />;
export const Privacy = () => <PlaceholderPage title="Privacy Policy" />;
export const Help = () => <PlaceholderPage title="Help Center" />;
export const Accessibility = () => <PlaceholderPage title="Accessibility" />;
