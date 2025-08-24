import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import UserProfileDashboard from './userProfileDashboard';
import ProfileEditForm from './ProfileEditForm';
import UserSettingsPage from './UserSettingsPage';
import Button from '../ui/Button';

const UserMainPage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug logging
  console.log('🗺️ UserMainPage - Current path:', location.pathname);
  console.log('🆔 UserMainPage - UserId from params:', userId);

  const handleBack = () => {
    console.log('🔙 Navigating back');
    navigate(-1);
  };

  // Determine which component to render based on exact path
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/profile/edit') {
      console.log('✅ Rendering ProfileEditForm');
      return <ProfileEditForm onBack={handleBack} />;
    }
    
    if (path === '/profile/settings') {
      console.log('✅ Rendering UserSettingsPage');
      return <UserSettingsPage onBack={handleBack} />;
    }
    
    if (path.startsWith('/users/') && userId) {
      console.log('✅ Rendering other user profile for userId:', userId);
      return (
        <UserProfileDashboard 
          userId={parseInt(userId)} 
          isCurrentUser={false}
        />
      );
    }
    
    if (path === '/profile') {
      console.log('✅ Rendering current user profile');
      return (
        <UserProfileDashboard 
          userId={null}
          isCurrentUser={true}
        />
      );
    }
    
    // Default fallback
    console.log('⚠️ Default fallback - rendering current user profile');
    return (
      <UserProfileDashboard 
        userId={null}
        isCurrentUser={true}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="p-4">
        <Button variant="secondary" onClick={handleBack} className="mb-4">
          ← Go Back
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default UserMainPage;