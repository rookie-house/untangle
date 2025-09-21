"use client";

import { useEffect } from "react";

const TokenPage = () => {
  useEffect(() => {
    // 1️⃣ Generate a fake token (for testing)
    const token = `test_token_${Math.random().toString(36).slice(2)}`;
    console.log("🔑 Generated token:", token);

    // 2️⃣ Save token to localStorage
    localStorage.setItem("token", token);
    console.log("💾 Token stored in localStorage");

    // 3️⃣ Send token to window event (for extension content script)
    setTimeout(() => {
      console.log("📤 Posting token to window event:", token);
      window.postMessage({ type: "SAVE_TO_EXTENSION", token }, "*");
    }, 500); // small delay to make sure content script is ready
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-2">Token Page</h1>
      <p className="text-gray-400">Generated token is saved and sent to extension.</p>
    </div>
  );
};

export default TokenPage;
