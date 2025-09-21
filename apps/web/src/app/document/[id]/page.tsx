"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useDemoDocuments } from '@/hooks/useDemoDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    FiArrowLeft,
    FiDownload,
    FiShare2,
    FiTrash2,
    FiSend,
    FiUser,
    FiMessageSquare,
    FiZap
} from 'react-icons/fi';
import Link from 'next/link';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

export default function DocumentDetailPage() {
    const params = useParams();
    const documentId = parseInt(params.id as string, 10);
    const { fetchDocumentById } = useDemoDocuments();
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [inputMessage, setInputMessage] = useState('');
    const messageListRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: `Hello! I'm your document AI assistant. Ask me any questions about this document, and I'll help you understand it better.`,
            role: 'assistant',
            timestamp: new Date()
        }
    ]);

    useEffect(() => {
        const loadDocument = async () => {
            if (documentId) {
                setLoading(true);
                const doc = await fetchDocumentById(documentId);
                setDocument(doc);
                setLoading(false);
            }
        };

        loadDocument();
    }, [documentId, fetchDocumentById]);

    useEffect(() => {
        // Scroll to the bottom of the message list when messages change
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: inputMessage,
            role: 'user',
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage(''); // Clear the input

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                content: `I'm analyzing your question about "${document?.title}". In a real implementation, this would connect to an AI service to provide an actual response based on the document content.`,
                role: 'assistant',
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, assistantMessage]);
        }, 1000);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
                <p className="text-muted-foreground mb-6">The document you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Header with navigation and actions */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <FiArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold truncate">{document.title}</h1>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <FiDownload className="h-4 w-4" />
                            <span>Download</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <FiShare2 className="h-4 w-4" />
                            <span>Share</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <FiTrash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </Button>
                    </div>
                </div>

                {/* Main content: Document preview and chat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Document preview */}
                    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-card">
                            <h2 className="font-semibold">Document Preview</h2>
                        </div>
                        <div className="p-4 min-h-[500px] flex items-center justify-center bg-secondary/10">
                            {document.type === 'image' ? (
                                <div className="w-full max-h-[700px] flex items-center justify-center">
                                    <img
                                        src={document.url}
                                        alt={document.title}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            ) : document.type === 'pdf' ? (
                                <div className="w-full flex flex-col items-center justify-center p-6">
                                    <div className="w-16 h-20 bg-red-500 rounded-t-md flex items-center justify-center text-white mb-2">
                                        PDF
                                    </div>
                                    <p className="text-sm text-muted-foreground">Preview not available. Click to download.</p>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">No preview available</div>
                            )}
                        </div>
                    </div>

                    {/* Chat interface */}
                    <div className="bg-card rounded-lg shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b bg-card">
                            <h2 className="font-semibold flex items-center">
                                <FiMessageSquare className="mr-2" /> Chat with Document
                            </h2>
                        </div>
                        <div className="flex-1 flex flex-col min-h-[500px]">
                            {/* Message List */}
                            <div
                                ref={messageListRef}
                                className="flex-1 p-4 overflow-y-auto space-y-4"
                            >
                                {messages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2 mb-1">
                                                {message.role === 'user' ? (
                                                    <FiUser className="h-4 w-4" />
                                                ) : (
                                                    <FiZap className="h-4 w-4" />
                                                )}
                                                <span className="text-xs opacity-80">
                                                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                                                </span>
                                                <span className="text-xs opacity-60">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                            <div>{message.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <Input
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Ask a question about this document..."
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
                                        <FiSend className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
                <p className="text-muted-foreground mb-6">The document you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Header with navigation and actions */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <FiArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold truncate">{document.title}</h1>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <FiDownload className="h-4 w-4" />
                            <span>Download</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <FiShare2 className="h-4 w-4" />
                            <span>Share</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <FiTrash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </Button>
                    </div>
                </div>

                {/* Main content: Document preview and chat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Document preview */}
                    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-card">
                            <h2 className="font-semibold">Document Preview</h2>
                        </div>
                        <div className="p-4 min-h-[500px] flex items-center justify-center bg-secondary/10">
                            {document.type === 'image' ? (
                                <div className="w-full max-h-[700px] flex items-center justify-center">
                                    <img
                                        src={document.url}
                                        alt={document.title}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            ) : document.type === 'pdf' ? (
                                <div className="w-full flex flex-col items-center justify-center p-6">
                                    <div className="w-16 h-20 bg-red-500 rounded-t-md flex items-center justify-center text-white mb-2">
                                        PDF
                                    </div>
                                    <p className="text-sm text-muted-foreground">Preview not available. Click to download.</p>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">No preview available</div>
                            )}
                        </div>
                    </div>

                    {/* Chat interface */}
                    <div className="bg-card rounded-lg shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b bg-card">
                            <h2 className="font-semibold flex items-center">
                                <FiMessageSquare className="mr-2" /> Chat with Document
                            </h2>
                        </div>
                        <div className="flex-1 flex flex-col min-h-[500px]">
                            {/* Message List */}
                            <div
                                ref={messageListRef}
                                className="flex-1 p-4 overflow-y-auto space-y-4"
                            >
                                {messages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2 mb-1">
                                                {message.role === 'user' ? (
                                                    <FiUser className="h-4 w-4" />
                                                ) : (
                                                    <FiZap className="h-4 w-4" />
                                                )}
                                                <span className="text-xs opacity-80">
                                                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                                                </span>
                                                <span className="text-xs opacity-60">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                            <div>{message.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <Input
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Ask a question about this document..."
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
                                        <FiSend className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}