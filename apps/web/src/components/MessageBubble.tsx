import React from 'react';
import { Copy, Check, Zap } from 'lucide-react';
import Image from 'next/image';

interface MessageProps {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  tokens?: {
    prompt: number;
    candidates: number;
  };
  avatar?: string;
}

const MessageBubble: React.FC<MessageProps> = ({ role, content, timestamp, tokens, avatar }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalTokens = tokens ? tokens.prompt + tokens.candidates : 0;

  if (role === 'user') {
    return (
      <div className="flex justify-end w-full">
        <div className="flex gap-3 max-w-md items-end">
          {avatar && (
            <div className="flex-shrink-0">
              <Image
                src={avatar}
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
          )}
          <div className="bg-blue-100 text-gray-900 rounded-2xl rounded-tr-none px-4 py-3">
            <p className="text-sm break-words leading-relaxed">{content}</p>
            <p className="text-xs text-gray-500 mt-2">{timestamp}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start w-full">
      <div className="flex gap-3 max-w-2xl items-start">
        {/* Logo/Avatar for model */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center mt-1">
          <span className="text-white text-xs font-bold">
            <Image
              src="/logo.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </span>
        </div>

        <div className="flex-1">
          <div className="bg-purple-50 border border-purple-100 text-gray-900 rounded-2xl rounded-tl-none px-4 py-3 group">
            <p className="text-sm break-words leading-relaxed">{content}</p>

            {/* Footer with timestamp, tokens and copy */}
            <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
              <span className="text-xs text-gray-500">{timestamp}</span>

              <div className="flex items-center gap-2">
                {/* {totalTokens > 0 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {totalTokens}
                  </span>
                )} */}

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-purple-100 rounded"
                  title="Copy message"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
