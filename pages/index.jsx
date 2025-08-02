import React, { useState } from 'react';
import LoginCard from '@/components/Cards/LoginCard';
import SignupCard from '@/components/Cards/SignupCard';

export default function Index() {
  const [isLogin, setisLogin] = useState(true);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="hidden md:block md:w-1/2">
        <img
          src="/loginbg.png"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 overflow-y-auto">
        {isLogin ? (
          <LoginCard setIsLogin={setisLogin} />
        ) : (
          <SignupCard setIsLogin={setisLogin} />
        )}
      </div>
    </div>
  );
}
