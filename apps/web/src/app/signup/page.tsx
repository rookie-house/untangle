"use client";
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';

type SignupFormValues = {
    name: string;
    email: string;
    password: string;
};

export default function SignupPage() {
    const { handleSignup, handleGoogleSignIn, loading, error } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        defaultValues: { name: '', email: '', password: '' },
    });

    const onSubmit = async (data: SignupFormValues) => {
        try {
            await handleSignup({ name: data.name, email: data.email, password: data.password });
        } catch (err) {
            // handled in hook
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#18181B] text-white relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-purple-600/30 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-48 h-48 rounded-full bg-zinc-700/30 blur-3xl animate-pulse" />

            <div className="w-full max-w-md z-10 p-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                    <p className="text-zinc-400">Sign up for free to access all features</p>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-3 transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                        </svg>
                        Continue with Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-3 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        Continue with GitHub
                    </button>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#18181B] text-zinc-500">or</span>
                    </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            {...register('name', { required: 'Name is required' })}
                            className="w-full px-4 py-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="E-mail"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                            })}
                            className="w-full px-4 py-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                            className="w-full px-4 py-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-red-400 text-sm text-center">{error}</div>
                )}

                <div className="mt-6 text-center text-zinc-500">
                    <p>
                        Already have an account?{' '}
                        <a href="/login" className="text-white hover:underline">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
