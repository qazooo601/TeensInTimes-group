import React from 'react';
import UserProfile from '../components/Profile/UserProfile';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleUpdateProfile = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // 可以觸發父組件重新渲染
    window.location.reload();
  };

  return <UserProfile user={user} onUpdateProfile={handleUpdateProfile} />;
};

export default Profile;
