"use client";

import LoadingScreen from "@/components/LandingScreen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Auto-redirect to registration
    const timer = setTimeout(() => {
      router.push("/registration");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return <LoadingScreen />;
}
