import React from 'react';
import { Copy, Check } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'model';
  content: string | object;
  timestamp: string;
  tokens?: {
    prompt: number;
    candidates: number;
  };
  avatar?: string;
}

const StructuredContent: React.FC<{
  data: string | object | number | boolean | null;
  level?: number;
}> = ({ data, level = 0 }) => {
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return <StructuredContent data={parsed} level={level} />;
    } catch {
      return <p className="text-sm break-words leading-relaxed whitespace-pre-wrap">{data}</p>;
    }
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white/50 rounded-lg p-4 border border-purple-100">
            <div className="flex gap-3 items-start">
              <span className="text-purple-600 font-semibold text-sm mt-0.5 flex-shrink-0">
                {idx + 1}.
              </span>
              <div className="flex-1">
                <StructuredContent data={item} level={level} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <div className="font-bold text-purple-800 text-sm mb-2 capitalize flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              {key.replace(/_/g, ' ')}
            </div>
            <div className="ml-4">
              <StructuredContent data={value} level={level + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-sm text-gray-700">{String(data)}</span>;
};

const MessageBubble: React.FC<MessageProps> = ({ role, content, timestamp, tokens, avatar }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(textContent);
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
              <img src={avatar} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
            </div>
          )}
          <div className="bg-blue-100 text-gray-900 rounded-2xl rounded-tr-none px-4 py-3">
            <StructuredContent data={content} />
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
            <img
              src="/logo.png"
              alt="Model Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </span>
        </div>

        <div className="flex-1">
          <div className="bg-purple-50 border border-purple-100 text-gray-900 rounded-2xl rounded-tl-none px-4 py-3 group">
            <StructuredContent data={content} />

            {/* Footer with timestamp, tokens and copy */}
            <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
              <span className="text-xs text-gray-500">{timestamp}</span>

              <div className="flex items-center gap-2">
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
