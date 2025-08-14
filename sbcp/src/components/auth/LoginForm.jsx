import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authService } from '../../services/authservice';

const LoginForm = ({ onToggleMode }) => {
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
    // Clear error when user starts typing
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
      
      // Show success message
      alert('Login successful! Welcome back.');
      
      // Redirect to dashboard or home page
      // You can replace this with your routing logic
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-xl rounded-3xl border-white/20">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-purple-500/25">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-slate-300">Sign in to your account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 border rounded-lg bg-red-500/10 border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
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
              className="w-4 h-4 text-purple-500 rounded bg-white/10 border-white/20 focus:ring-purple-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-slate-300">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-purple-400 transition-colors hover:text-purple-300"
          >
            Forgot password?
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          loading={isLoading}
          icon={ArrowRight}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>

      {/* Toggle Mode */}
      <div className="mt-8 text-center">
        <p className="text-slate-300">Don't have an account?</p>
        <button
          onClick={onToggleMode}
          className="mt-2 font-semibold text-purple-400 transition-colors hover:text-purple-300 hover:underline"
        >
          Sign up for free
        </button>
      </div>

      {/* Social Login */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-900/50 text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="secondary">Google</Button>
          <Button variant="secondary">GitHub</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;