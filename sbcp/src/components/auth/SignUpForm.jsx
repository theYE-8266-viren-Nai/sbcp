
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authService } from '../../services/authService';

const SignupForm = ({ onToggleMode }) => {
  const navigate = useNavigate();
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
    
    if (error) setError('');
  };

  const handleSubmit = async () => {
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
      navigate('/');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-brand-400 to-brand-500 rounded-pinterest shadow-pinterest">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-brand-600">Join our community</h2>
        <p className="text-brand-500/70">Create your account and start learning together</p>
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
          placeholder="Create a password (min 6 characters)"
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
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>

      {/* Terms */}
      <p className="mt-6 text-xs leading-relaxed text-center text-brand-500/60">
        By creating an account, you agree to our{' '}
        <a href="#" className="transition-colors text-brand-500 hover:text-brand-400">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="transition-colors text-brand-500 hover:text-brand-400">Privacy Policy</a>
      </p>

      {/* Toggle Mode */}
      <div className="mt-8 text-center">
        <p className="text-brand-500/70">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="font-semibold transition-colors text-brand-500 hover:text-brand-400"
          >
            Sign in here
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

export default SignupForm;