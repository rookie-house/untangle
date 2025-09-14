import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>

      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-6 pt-80 flex flex-col items-center">
        <section className="w-full max-w-5xl text-center">
          {/* Hero Section */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 leading-tight mb-4">
            Cut Through Legal Jargon with Clarity
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Untangle turns complex legal documents into plain-language insights. 
            See the key clauses, risks, and obligations — no legal degree required.
          </p>

          {/* Split Layout Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mt-10">
            {/* Left Side - Illustration / Image */}
            <div className="flex-1 flex justify-center">
              <div className="bg-gray-800 rounded-2xl p-6 h-72 w-72 flex items-center justify-center shadow-lg">
                {/* Placeholder for image/illustration */}
                <Image
                  src="/Untangible.svg"
                  alt="Document Preview"
                  width={288}
                  height={288}
                  className="object-cover"
                /> 
              </div>
            </div>

            {/* Right Side - Feature Highlights */}
            <div className="flex-1 space-y-6 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">
                  📜 Agreement Analysis
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Automatically scan and detect hidden clauses, policies, and obligations 
                  in seconds.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">
                  💡 Clear Insights
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Get clear, actionable summaries that help you make informed decisions faster.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">
                  🤝 Team Collaboration
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Share documents, leave comments, and work with your team in real-time.
                </p>
              </div>

              <Link
                href="/signup"
                className="inline-block mt-4 px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 hover:scale-[1.02] transition-transform"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
