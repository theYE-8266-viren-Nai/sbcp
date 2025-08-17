
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';
import FeatureSection from './FeatureSection';

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 font-pinterest">
      {/* Pinterest-style floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-brand-400/20 to-brand-500/20 blur-3xl"></div>
        <div className="absolute rounded-full top-1/3 -right-8 w-96 h-96 bg-gradient-to-br from-brand-300/30 to-brand-400/30 blur-3xl"></div>
        <div className="absolute rounded-full -bottom-8 left-1/3 w-80 h-80 bg-gradient-to-br from-brand-200/40 to-brand-300/40 blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="grid w-full gap-12 max-w-7xl lg:grid-cols-2 lg:gap-16">
          
          {/* Feature Section - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <FeatureSection />
          </div>

          {/* Auth Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {isLogin ? (
                <LoginForm onToggleMode={toggleMode} />
              ) : (
                <SignupForm onToggleMode={toggleMode} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;