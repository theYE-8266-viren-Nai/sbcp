import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authService } from '../../services/authService'; // 🎯 Fixed import (authService not authservice)

const SignupForm = ({ onToggleMode }) => {
  const navigate = useNavigate(); // 🎯 Added navigation hook
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle full name input - split into firstName and lastName
    if (name === 'name') {
      const nameParts = value.split(' ');
      setFormData({
        ...formData,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration successful:', response);
      
      // 🎯 Updated: Use React Router navigation instead of window.location
      navigate('/'); // Navigate to index page
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
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
        <h2 className="mb-2 text-2xl font-bold text-white">Create Account</h2>
        <p className="text-slate-300">Join us today and get started</p>
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
          label="Full Name"
          type="text"
          name="name"
          value={`${formData.firstName} ${formData.lastName}`.trim()}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          icon={User}
          required
        />

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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password (min 6 characters)"
          icon={Lock}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          icon={Lock}
          required
        />

        <Button
          onClick={handleSubmit}
          loading={isLoading}
          icon={ArrowRight}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>

      {/* Toggle Mode */}
      <div className="mt-8 text-center">
        <p className="text-slate-300">Already have an account?</p>
        <button
          onClick={onToggleMode}
          className="mt-2 font-semibold text-purple-400 transition-colors hover:text-purple-300 hover:underline"
        >
          Sign in here
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

export default SignupForm;