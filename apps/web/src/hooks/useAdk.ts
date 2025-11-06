'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { parseADKResponse } from '@/lib/adk-parser';

export interface Session {
  id: string;
  title: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  tokens?: {
    prompt: number;
    candidates: number;
  };
}

interface ChatPayload {
  message: string;
  sessionId?: string;
  img?: Array<{
    name: string;
    type: string;
    size: number;
    path?: string;
    data: string; // Base64 string or data URL
  }>;
}

function extractErrorMessage(err: unknown, fallback: string) {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object') {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
    const apiMsg = (err as { response?: { data?: { message?: unknown } } })?.response?.data
      ?.message;
    if (typeof apiMsg === 'string') return apiMsg;
  }
  return fallback;
}

export function useAdk() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleGetSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.adk.getSessions();
      setSessions(res.data.data?.sessions || []);
      return res.data.data;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Failed to fetch sessions');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.adk.createSession();
      const newSession = res.data.data;
      setSessions((prev) => [...prev, newSession]);
      return newSession;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Failed to create session');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStartChat = useCallback(async (payload: ChatPayload) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Send user message to API
      const { data } = await api.adk.startChat(payload);
      const response = data.data;

      // Step 2: Create user message object with explicit 'user' role
      const userMessage: Message = {
        id: `user-${crypto.randomUUID()}`,
        role: 'user', // ← EXPLICITLY MARKED AS USER
        content: payload.message,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      };

      // Step 3: Parse ADK response (contains model responses with role: 'model')
      const parsedMessages = parseADKResponse(response);

      // Step 4: Add both user and model messages to state
      // Order: User message first, then all model responses
      setMessages((prev) => [
        ...prev,
        userMessage, // ← User message (role: 'user')
        ...parsedMessages, // ← Model responses (role: 'model')
      ]);

      return response;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Failed to start chat');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.adk.deleteSession(sessionId);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      setMessages([]);
      return true;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Failed to delete session');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
}
