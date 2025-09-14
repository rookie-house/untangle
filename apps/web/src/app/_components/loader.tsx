import React from 'react';

export default function TailwindBoxLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <svg
          width="80"
          height="80"
          viewBox="0 0 36 36"
          className="text-blue-500"
          aria-label="Loading..."
        >
          {/* Box 1 */}
          <rect
            x="13" y="1" rx="1" width="10" height="10"
            className="fill-current animate-[box1_4s_infinite]"
          />

          {/* Box 2 */}
          <rect
            x="13" y="1" rx="1" width="10" height="10"
            className="fill-current animate-[box2_4s_infinite]"
          />

          {/* Box 3 */}
          <rect
            x="25" y="25" rx="1" width="10" height="10"
            className="fill-current animate-[box3_4s_infinite]"
          />

          {/* Box 4 */}
          <rect
            x="13" y="13" rx="1" width="10" height="10"
            className="fill-current animate-[box4_4s_infinite]"
          />

          {/* Box 5 */}
          <rect
            x="13" y="13" rx="1" width="10" height="10"
            className="fill-current animate-[box5_4s_infinite]"
          />

          {/* Box 6 */}
          <rect
            x="25" y="13" rx="1" width="10" height="10"
            className="fill-current animate-[box6_4s_infinite]"
          />

          {/* Box 7 */}
          <rect
            x="1" y="25" rx="1" width="10" height="10"
            className="fill-current animate-[box7_4s_infinite]"
          />

          {/* Box 8 */}
          <rect
            x="13" y="25" rx="1" width="10" height="10"
            className="fill-current animate-[box8_4s_infinite]"
          />

          {/* Box 9 */}
          <rect
            x="25" y="25" rx="1" width="10" height="10"
            className="fill-current animate-[box9_4s_infinite]"
          />
        </svg>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes box1 {
            9.09% { transform: translate(-12px, 0); }
            18.18% { transform: translate(0px, 0); }
            27.27% { transform: translate(0px, 0); }
            36.36% { transform: translate(12px, 0); }
            45.45% { transform: translate(12px, 12px); }
            54.55% { transform: translate(12px, 12px); }
            63.64% { transform: translate(12px, 12px); }
            72.73% { transform: translate(12px, 0px); }
            81.82% { transform: translate(0px, 0px); }
            90.91% { transform: translate(-12px, 0px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box2 {
            9.09% { transform: translate(0, 0); }
            18.18% { transform: translate(12px, 0); }
            27.27% { transform: translate(0px, 0); }
            36.36% { transform: translate(12px, 0); }
            45.45% { transform: translate(12px, 12px); }
            54.55% { transform: translate(12px, 12px); }
            63.64% { transform: translate(12px, 12px); }
            72.73% { transform: translate(12px, 12px); }
            81.82% { transform: translate(0px, 12px); }
            90.91% { transform: translate(0px, 12px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box3 {
            9.09% { transform: translate(-12px, 0); }
            18.18% { transform: translate(-12px, 0); }
            27.27% { transform: translate(0px, 0); }
            36.36% { transform: translate(-12px, 0); }
            45.45% { transform: translate(-12px, 0); }
            54.55% { transform: translate(-12px, 0); }
            63.64% { transform: translate(-12px, 0); }
            72.73% { transform: translate(-12px, 0); }
            81.82% { transform: translate(-12px, -12px); }
            90.91% { transform: translate(0px, -12px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box4 {
            9.09% { transform: translate(-12px, 0); }
            18.18% { transform: translate(-12px, 0); }
            27.27% { transform: translate(-12px, -12px); }
            36.36% { transform: translate(0px, -12px); }
            45.45% { transform: translate(0px, 0px); }
            54.55% { transform: translate(0px, -12px); }
            63.64% { transform: translate(0px, -12px); }
            72.73% { transform: translate(0px, -12px); }
            81.82% { transform: translate(-12px, -12px); }
            90.91% { transform: translate(-12px, 0px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box5 {
            9.09% { transform: translate(0, 0); }
            18.18% { transform: translate(0, 0); }
            27.27% { transform: translate(0, 0); }
            36.36% { transform: translate(12px, 0); }
            45.45% { transform: translate(12px, 0); }
            54.55% { transform: translate(12px, 0); }
            63.64% { transform: translate(12px, 0); }
            72.73% { transform: translate(12px, 0); }
            81.82% { transform: translate(12px, -12px); }
            90.91% { transform: translate(0px, -12px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box6 {
            9.09% { transform: translate(0, 0); }
            18.18% { transform: translate(-12px, 0); }
            27.27% { transform: translate(-12px, 0); }
            36.36% { transform: translate(0px, 0); }
            45.45% { transform: translate(0px, 0); }
            54.55% { transform: translate(0px, 0); }
            63.64% { transform: translate(0px, 0); }
            72.73% { transform: translate(0px, 12px); }
            81.82% { transform: translate(-12px, 12px); }
            90.91% { transform: translate(-12px, 0px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box7 {
            9.09% { transform: translate(12px, 0); }
            18.18% { transform: translate(12px, 0); }
            27.27% { transform: translate(12px, 0); }
            36.36% { transform: translate(0px, 0); }
            45.45% { transform: translate(0px, -12px); }
            54.55% { transform: translate(12px, -12px); }
            63.64% { transform: translate(0px, -12px); }
            72.73% { transform: translate(0px, -12px); }
            81.82% { transform: translate(0px, 0px); }
            90.91% { transform: translate(12px, 0px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box8 {
            9.09% { transform: translate(0, 0); }
            18.18% { transform: translate(-12px, 0); }
            27.27% { transform: translate(-12px, -12px); }
            36.36% { transform: translate(0px, -12px); }
            45.45% { transform: translate(0px, -12px); }
            54.55% { transform: translate(0px, -12px); }
            63.64% { transform: translate(0px, -12px); }
            72.73% { transform: translate(0px, -12px); }
            81.82% { transform: translate(12px, -12px); }
            90.91% { transform: translate(12px, 0px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes box9 {
            9.09% { transform: translate(-12px, 0); }
            18.18% { transform: translate(-12px, 0); }
            27.27% { transform: translate(0px, 0); }
            36.36% { transform: translate(-12px, 0); }
            45.45% { transform: translate(0px, 0); }
            54.55% { transform: translate(0px, 0); }
            63.64% { transform: translate(-12px, 0); }
            72.73% { transform: translate(-12px, 0); }
            81.82% { transform: translate(-24px, 0); }
            90.91% { transform: translate(-12px, 0); }
            100% { transform: translate(0px, 0); }
          }
          
          .animate-\\[box1_4s_infinite\\] { animation: box1 4s infinite; }
          .animate-\\[box2_4s_infinite\\] { animation: box2 4s infinite; }
          .animate-\\[box3_4s_infinite\\] { animation: box3 4s infinite; }
          .animate-\\[box4_4s_infinite\\] { animation: box4 4s infinite; }
          .animate-\\[box5_4s_infinite\\] { animation: box5 4s infinite; }
          .animate-\\[box6_4s_infinite\\] { animation: box6 4s infinite; }
          .animate-\\[box7_4s_infinite\\] { animation: box7 4s infinite; }
          .animate-\\[box8_4s_infinite\\] { animation: box8 4s infinite; }
          .animate-\\[box9_4s_infinite\\] { animation: box9 4s infinite; }
          `
        }} />

        <div className="text-center mt-6">
          <p className="text-gray-400 text-xl font-medium animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}