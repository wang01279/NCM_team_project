
import { useState, useEffect } from 'react';
import { auth } from '@/app/_config/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';

export const useAuth = () => {
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 從 localStorage 載入會員資料
    const loadMember = () => {
      try {
        const storedMember = localStorage.getItem('member');
        const storedToken = localStorage.getItem('token');
        
        if (storedMember && storedToken) {
          const memberData = JSON.parse(storedMember);
          setMember(memberData);
          setToken(storedToken);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('載入會員資料失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMember();

    // 監聽登入事件
    const handleLogin = (event) => {
      const memberData = event.detail;
      setMember(memberData);
      setIsLoggedIn(true);
      localStorage.setItem('member', JSON.stringify(memberData));
    };

    // 監聽登出事件
    const handleLogout = () => {
      setMember(null);
      setToken(null);
      setIsLoggedIn(false);
      localStorage.removeItem('member');
      localStorage.removeItem('token');
    };

    window.addEventListener('memberLogin', handleLogin);
    window.addEventListener('memberLogout', handleLogout);

    return () => {
      window.removeEventListener('memberLogin', handleLogin);
      window.removeEventListener('memberLogout', handleLogout);
    };
  }, []);

  const updateMember = (newMemberData) => {
    setMember(newMemberData);
    localStorage.setItem('member', JSON.stringify(newMemberData));
  };

  const logout = async () => {
    try {
      // 登出 Firebase
      await firebaseSignOut(auth);
      
      // 清除 localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('member');
      
      // 觸發登出事件
      window.dispatchEvent(new Event('memberLogout'));
    } catch (error) {
      console.error('登出失敗:', error);
      throw error;
    }
  };

  return {
    member,
    token,
    isLoading,
    isLoggedIn,
    updateMember,
    logout
  };
};