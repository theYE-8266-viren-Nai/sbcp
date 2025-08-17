
import React from 'react';
import { Shield, Zap, Users, Heart, BookOpen, MessageCircle } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect with Students",
      description: "Build meaningful connections with fellow students from around the world"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Share Knowledge",
      description: "Create and discover study materials, notes, and academic resources"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Study Groups",
      description: "Join or create study groups for collaborative learning experiences"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Safe Community",
      description: "Academic-focused environment with verified student profiles"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Get instant notifications about study sessions and group activities"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security measures"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Header */}
      <div className="space-y-6">
        <h1 className="text-5xl font-bold leading-tight text-brand-600">
          Welcome to your
          <span className="block text-transparent bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text">
            Student Community
          </span>
        </h1>
        <p className="text-xl leading-relaxed text-brand-500/80">
          Connect, collaborate, and succeed together. Join thousands of students 
          sharing knowledge and building their academic future.
        </p>
      </div>

      {/* Features Grid - Pinterest style cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="p-6 transition-all duration-300 border group bg-white/80 backdrop-blur-sm rounded-pinterest shadow-pinterest hover:shadow-pinterest-hover hover:scale-105 border-brand-200/30"
          >
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-white transition-transform duration-300 shadow-lg bg-gradient-to-br from-brand-400 to-brand-500 rounded-xl group-hover:scale-110">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold transition-colors text-brand-600 group-hover:text-brand-500">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-500/70">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-brand-500/60">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 border-2 border-white rounded-full bg-gradient-to-br from-brand-300 to-brand-400"></div>
            <div className="w-8 h-8 border-2 border-white rounded-full bg-gradient-to-br from-brand-400 to-brand-500"></div>
            <div className="w-8 h-8 border-2 border-white rounded-full bg-gradient-to-br from-brand-500 to-brand-600"></div>
          </div>
          <span className="text-sm font-medium">Join 10,000+ students already connected</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;