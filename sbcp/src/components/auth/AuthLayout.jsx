import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';
import FeatureSection from './FeatureSection';
import BackgroundEffects from '../ui/BackgroundEffect';

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <BackgroundEffects />
      
      <div className="relative grid items-center w-full max-w-6xl gap-8 lg:grid-cols-2">
        <FeatureSection />
        
        <div className="w-full max-w-md mx-auto">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <SignupForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;