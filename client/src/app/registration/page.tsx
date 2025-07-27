"use client";

import LoadingScreen from "@/components/LandingScreen";
import Logo from "@/components/Logo";
import RegistrationForm from "@/components/RegistrationForm";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegistrationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegistrationComplete = () => {
    setIsLoading(true);

    // Simulate loading time
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <Logo />
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center px-4">
        <RegistrationForm onComplete={handleRegistrationComplete} />
      </div>
    </div>
  );
};

export default RegistrationPage;
