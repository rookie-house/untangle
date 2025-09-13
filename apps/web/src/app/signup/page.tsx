"use client";
import { useAuth } from '../../hooks/useAuth';

export default function SignupPage() {
    const { handleSignup, handleGoogleSignIn, loading, error } = useAuth();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-zinc-900 to-zinc-950 text-white">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Left Side */}
                <div className="md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-b from-blue-800 to-blue-900 p-8 md:p-12">
                    <div className="flex flex-col items-center">
                        <div className="bg-white rounded-full p-4 mb-4">
                            {/* Rocket SVG */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C13.1046 2 14 2.89543 14 4V6.382C16.8348 7.16509 19 9.61305 19 12.5V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V12.5C5 9.61305 7.16519 7.16509 10 6.382V4C10 2.89543 10.8954 2 12 2Z" fill="#2563eb" />
                                <circle cx="12" cy="14" r="2" fill="#2563eb" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Welcome to</h1>
                        <h2 className="text-3xl font-extrabold mb-4 tracking-wide">untangle</h2>
                        <p className="text-sm text-blue-100 mb-8 max-w-xs text-center">
                            Create your untangle account and unlock seamless collaboration, communication, and productivity. Join us and get started instantly!
                        </p>
                        <div className="flex gap-4 text-xs text-blue-200 mt-auto">
                            <a href="#" className="hover:underline">CREATORS HERE</a>
                            <a href="#" className="hover:underline">DESIGNERS HERE</a>
                        </div>
                    </div>
                </div>
                {/* Right Side */}
                <div className="md:w-1/2 flex flex-col justify-center items-center bg-zinc-900 p-8 md:p-12">
                    <div className="w-full max-w-md">
                        <h2 className="text-xl font-bold mb-6 text-center">Create your account</h2>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 w-full mb-4 shadow transition disabled:opacity-60 font-semibold"
                        >
                            {loading ? 'Signing up...' : 'Sign up with Google'}
                        </button>
                        {error && <div className="text-red-400 mt-2 text-sm text-center">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
