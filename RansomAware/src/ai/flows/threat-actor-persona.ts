'use server';

/**
 * @fileOverview This file defines a Genkit flow for simulating a ransomware threat actor with a consistent persona.
 *
 * - `threatActorPersona`: A function that takes user input and generates threat actor responses while maintaining a consistent persona.
 * - `ThreatActorPersonaInput`: The input type for the `threatActorPersona` function, including the user's message and chat history.
 * - `ThreatActorPersonaOutput`: The output type for the `threatActorPersona` function, containing the threat actor's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThreatActorPersonaInputSchema = z.object({
  message: z.string().describe('The user message to the threat actor.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'threat_actor']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the threat actor.'),
});
export type ThreatActorPersonaInput = z.infer<typeof ThreatActorPersonaInputSchema>;

const ThreatActorPersonaOutputSchema = z.object({
  response: z.string().describe('The threat actor response to the user message.'),
});
export type ThreatActorPersonaOutput = z.infer<typeof ThreatActorPersonaOutputSchema>;

export async function threatActorPersona(input: ThreatActorPersonaInput): Promise<ThreatActorPersonaOutput> {
  return threatActorPersonaFlow(input);
}

const threatActorPersonaPrompt = ai.definePrompt({
  name: 'threatActorPersonaPrompt',
  input: {schema: ThreatActorPersonaInputSchema},
  output: {schema: ThreatActorPersonaOutputSchema},
  prompt: `You are simulating a ransomware threat actor negotiating with a victim.
  Maintain a consistent persona throughout the negotiation. Be terse. Be confident. Be menacing, but avoid outright threats of violence.

  Chat History:
  {{#each chatHistory}}
    {{#if (eq role \"user\")}}
      User: {{{content}}}
    {{else}}
      Threat Actor: {{{content}}}
    {{/if}}
  {{/each}}

  User Message: {{{message}}}

  Threat Actor: `,
});

const threatActorPersonaFlow = ai.defineFlow(
  {
    name: 'threatActorPersonaFlow',
    inputSchema: ThreatActorPersonaInputSchema,
    outputSchema: ThreatActorPersonaOutputSchema,
  },
  async input => {
    const {output} = await threatActorPersonaPrompt(input);
    return output!;
  }
);
