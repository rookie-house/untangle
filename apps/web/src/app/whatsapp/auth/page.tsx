"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WhatsappAuthPage() {
	const router = useRouter();
	const [sessionId, setSessionId] = useState<string | null>(null);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		setSessionId(searchParams.get("sessionId"));
	}, []);

	const handleRedirect = (action: "login" | "signup") => {
		if (sessionId) {
			router.push(`/${action}?sessionId=${encodeURIComponent(sessionId)}`);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="text-center space-y-6">
				<span className="text-lg font-semibold">
					Choose an action for WhatsApp Auth
				</span>
				{sessionId ? (
					<div className="flex flex-col gap-4 mt-4">
						<button
							className="px-6 py-2 rounded bg-primary text-white font-bold hover:bg-primary/80 transition"
							onClick={() => handleRedirect("login")}
						>
							Login
						</button>
						<button
							className="px-6 py-2 rounded bg-secondary text-white font-bold hover:bg-secondary/80 transition"
							onClick={() => handleRedirect("signup")}
						>
							Sign Up
						</button>
					</div>
				) : (
					<div className="mt-4 text-red-500">Session ID not found in URL.</div>
				)}
			</div>
		</div>
	);
}
