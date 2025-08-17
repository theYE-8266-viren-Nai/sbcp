
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authService } from '../../services/authService';

const LoginForm = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      console.log('Login successful:', response);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-brand-600">Welcome back!</h2>
        <p className="text-brand-500/70">Sign in to continue your learning journey</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 border bg-pinterest-red/10 border-pinterest-red/20 rounded-pinterest">
          <p className="text-sm font-medium text-pinterest-red">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          icon={Mail}
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          icon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 bg-white rounded text-brand-500 border-brand-300 focus:ring-brand-400 focus:ring-2"
            />
            <span className="ml-2 text-sm text-brand-500/70">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm font-medium transition-colors text-brand-500 hover:text-brand-400"
          >
            Forgot password?
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>

      {/* Toggle Mode */}
      <div className="mt-8 text-center">
        <p className="text-brand-500/70">
          New to our community?{' '}
          <button
            onClick={onToggleMode}
            className="font-semibold transition-colors text-brand-500 hover:text-brand-400"
          >
            Create an account
          </button>
        </p>
      </div>

      {/* Social Login */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-brand-500/70">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button className="flex items-center justify-center px-4 py-3 transition-colors border border-brand-300 rounded-pinterest hover:bg-brand-50">
            <span className="text-sm font-medium text-brand-600">Google</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 transition-colors border border-brand-300 rounded-pinterest hover:bg-brand-50">
            <span className="text-sm font-medium text-brand-600">GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;