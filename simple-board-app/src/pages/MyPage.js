import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileView from '../components/mypage/ProfileView';
import ProfileEditForm from '../components/mypage/ProfileEditForm';

const MyPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfileView />} />
      <Route path="/edit" element={<ProfileEditForm />} />
    </Routes>
  );
};

export default MyPage; 