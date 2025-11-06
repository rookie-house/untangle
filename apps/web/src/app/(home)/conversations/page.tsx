'use client';

import React, { useState, useEffect } from 'react';
import { Send, Paperclip, RotateCcw, Copy, MessageCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAdk } from '@/hooks/useAdk';
import MessageBubble from '@/components/MessageBubble';

interface ConversationItem {
  id: string;
  title: string;
  excerpt: string;
  time: string;
  avatar?: string;
  isToday?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const ConversationsPage = () => {
  // Initialize useAdk hook
  const {
    sessions,
    messages,
    loading,
    error,
    handleGetSessions,
    handleCreateSession,
    handleStartChat,
    handleDeleteSession,
    clearMessages,
    clearError,
  } = useAdk();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      name: string;
      type: string;
      size: number;
      data: string; // Changed from File to string (base64)
    }>
  >([]);

  // Hydration fix: Only render after client-side mount
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Fetch sessions on component mount
  useEffect(() => {
    if (hydrated) {
      handleGetSessions();
    }
  }, [hydrated, handleGetSessions]);

  useEffect(() => {
    console.log('Message Content', messages);
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputValue(text);
    setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length);
  };

  const handleAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to base64 for JSON transmission
    const filePromises = Array.from(files).map(async (file) => {
      return new Promise<{
        name: string;
        type: string;
        size: number;
        data: string;
      }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result as string, // Base64 string
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Convert to base64
      });
    });

    try {
      const newFiles = await Promise.all(filePromises);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Failed to read files:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      // If no session selected, create a new one first
      if (!selectedConversation) {
        const newSession = await handleCreateSession();
        setSelectedConversation(newSession.id);
        await handleStartChat({
          message: inputValue,
          sessionId: newSession.id,
          img: uploadedFiles,
        });
      } else {
        await handleStartChat({
          message: inputValue,
          sessionId: selectedConversation,
          img: uploadedFiles,
        });
      }

      setInputValue('');
      setUploadedFiles([]);
      setWordCount(0);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleCreateNewSession = async () => {
    try {
      const newSession = await handleCreateSession();
      setSelectedConversation(newSession.id);
      clearMessages();
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    clearMessages();
  };

  const handleDelete = async (sessionId: string) => {
    try {
      await handleDeleteSession(sessionId);
      if (selectedConversation === sessionId) {
        setSelectedConversation(null);
        clearMessages();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const removeUploadedFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  // Mock data for fallback display
  const mockConversations: ConversationItem[] = [
    {
      id: '1',
      title: 'The First Crucial Hours',
      excerpt: 'With the iPhone 15 Pro... important.org/biography/item...',
      time: '12:35',
      isToday: true,
    },
    {
      id: '2',
      title: 'Best Practices for Developers in 2023',
      excerpt: 'medium.com/articles/best-pra...',
      time: '11:42',
      isToday: true,
    },
    {
      id: '3',
      title: 'Now You Can Generate AI...',
      excerpt: 'Images with ChatGPT: In... medium.com/ai-tools/connect...',
      time: '3:33',
      isToday: true,
    },
    {
      id: '4',
      title: '"My wife is dead"',
      excerpt: 'Software update can kill AI... dev.to/software-update/2...',
      time: '8:12',
      isToday: false,
    },
    {
      id: '5',
      title: 'Rethinking cyber security',
      excerpt: 'in companies...',
      time: '2:08',
      isToday: false,
    },
    {
      id: '6',
      title: 'How do language models',
      excerpt: 'generate text? - About t... ai.ft.com/generate-text-ai/',
      time: '1:36',
      isToday: false,
    },
  ];

  // Prevent hydration mismatch by not rendering until hydrated
  if (!hydrated) {
    return null;
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Left Sidebar - Conversations History */}
      <div className="w-64 bg-white rounded-2xl p-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">History</h2>
          <p className="text-sm text-gray-500">Recent conversations</p>
        </div>

        {/* New Session Button */}
        <button
          onClick={handleCreateNewSession}
          disabled={loading}
          className="w-full px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {loading ? 'Loading...' : '+ New Session'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="px-3 py-2 mb-3 bg-red-50 text-red-700 rounded-lg text-xs">{error}</div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {/* Display real sessions if available */}
          {sessions.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2">Sessions</h3>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedConversation === session.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } cursor-pointer`}
                  >
                    <button
                      key={session.id}
                      onClick={() => handleSelectConversation(session.id)}
                      className={`w-full text-left rounded-lg transition-colors ${
                        selectedConversation === session.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Image
                          src="https://github.com/shadcn.png"
                          alt="avatar"
                          width={32}
                          height={32}
                          className="rounded-full flex-shrink-0 mt-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            summarize document
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {/* {session.excerpt} */}
                            google.com/document/untangle...
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {/* {session.time} */}
                            Just now
                          </p>
                        </div>
                      </div>
                    </button>
                    {/* <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(session.id);
                                            }}
                                            className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors ml-2"
                                            disabled={loading}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button> */}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Today Section */}
              {/* <div>
                                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2">
                                    Today
                                </h3>
                                <div className="space-y-2">
                                    {mockConversations
                                        .filter((conv) => conv.isToday)
                                        .map((conversation) => (
                                            <button
                                                key={conversation.id}
                                                onClick={() => handleSelectConversation(conversation.id)}
                                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedConversation === conversation.id
                                                        ? 'bg-blue-50'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <Image
                                                        src="https://github.com/shadcn.png"
                                                        alt="avatar"
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full flex-shrink-0 mt-1"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {conversation.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {conversation.excerpt}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {conversation.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            </div> */}

              {/* Yesterday Section */}
              {/* <div>
                                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2 mt-4">
                                    Yesterday
                                </h3>
                                <div className="space-y-2">
                                    {mockConversations
                                        .filter((conv) => !conv.isToday)
                                        .map((conversation) => (
                                            <button
                                                key={conversation.id}
                                                onClick={() => handleSelectConversation(conversation.id)}
                                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedConversation === conversation.id
                                                        ? 'bg-blue-50'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <Image
                                                        src="https://github.com/shadcn.png"
                                                        alt="avatar"
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full flex-shrink-0 mt-1"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {conversation.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {conversation.excerpt}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {conversation.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                </div> */}
              {/* </div> */}
              <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
                Please Create a new session to start chatting.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full gap-6">
        {/* Top Section - Attached Document and Question */}
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-6">
          {/* Attached Document */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Attached Document</h3>
            <p className="text-xs text-gray-500 mb-4">Display Attached Document</p>
            <div className="bg-gray-50 rounded-lg p-4 h-[90%] flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-300" />
            </div>
            <div className="flex gap-2 mt-4">
              <button className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                URL
              </button>
              <button className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Doc
              </button>
              <button className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Text
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white h-full rounded-2xl p-6 flex flex-col">
            {/* Tab Section */}
            <div className="flex gap-2 mb-6">
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                URL
              </button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Doc
              </button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Text
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 mb-4 overflow-y-auto max-h-[60vh] pr-2 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Start a new conversation</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      tokens={message.tokens}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="space-y-3 border-t pt-4">
              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-2"
                    >
                      {file.name}
                      <button
                        onClick={() => removeUploadedFile(file.name)}
                        className="hover:text-blue-900 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter Prompt Here"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />

              {/* Bottom Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleAttach}
                      className="hidden"
                      title="Attach file"
                      multiple
                    />
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </label>
                  <button
                    onClick={() => {
                      setInputValue('');
                      setUploadedFiles([]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Clear"
                  >
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{wordCount} words</span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || loading}
                    className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;
