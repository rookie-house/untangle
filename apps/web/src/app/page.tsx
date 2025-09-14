"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src="/logo.png"
        alt="Untangle Logo"
        width={300}
        height={300}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">Welcome to Untangle</h1>
      <p className="text-lg text-center mt-5 max-w-2xl">
        Demystify, summarize, and uncover risks in legal documents.
      </p>
      <button onClick={() => router.push("/signup")} className="mt-10 px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition">
        Get Started
      </button>
    </div>
  );
}
