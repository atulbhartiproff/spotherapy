"use client";
import { useEffect, useState } from "react";
import App from "./tabs/home";
import MobApp from "./tabs/mobhome";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    setIsMobile(/android|iPad|iPhone|iPod/i.test(userAgent.toLowerCase()));
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
      {isMobile ? <MobApp /> : <App />}
    </div>
  );
}
