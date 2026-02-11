import React from 'react';
import UserProfile from '../components/Profile/UserProfile';
import { usePageTitle } from '../hooks/usePageTitle';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  usePageTitle('個人資料｜時代少年團');

  const handleUpdateProfile = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // 可以觸發父組件重新渲染
    window.location.reload();
  };

  return <UserProfile user={user} onUpdateProfile={handleUpdateProfile} />;
};

export default Profile;
