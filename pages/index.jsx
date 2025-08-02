import React, { useState } from 'react';
import LoginCard from '@/components/Cards/LoginCard';
import SignupCard from '@/components/Cards/SignupCard';

export default function Index() {
  const [isLogin, setisLogin] = useState(true)
  return (
    <div className="h-screen flex bg-gray-100">
      <div className="w-1/2 hidden md:block">
        <img
          src="/loginbg.png"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {isLogin ?
        <LoginCard setIsLogin={setisLogin} />
        :
        <SignupCard setIsLogin={setisLogin} />
      }
    </div>
  );
}
