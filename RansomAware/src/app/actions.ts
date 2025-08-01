'use server';

import { threatActorPersona } from '@/ai/flows/threat-actor-persona';
import type { ThreatActorPersonaInput } from '@/ai/flows/threat-actor-persona';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function getAIResponse(messages: ChatMessage[]): Promise<string> {
  const userMessage = messages.findLast((m) => m.role === 'user');
  if (!userMessage) {
    return "I'm sorry, I don't have a message to respond to.";
  }

  const chatHistory: ThreatActorPersonaInput['chatHistory'] = messages
    .slice(0, -1) // Exclude the latest user message which is passed separately
    .map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'threat_actor',
      content: msg.content,
    }));

  try {
    const result = await threatActorPersona({
      message: userMessage.content,
      chatHistory: chatHistory,
    });
    return result.response;
  } catch (error) {
    console.error('Error calling AI flow:', error);
    return 'An error occurred while generating a response. Please try again.';
  }
}
