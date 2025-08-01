// The AI flow to simulate a threat actor's response in a negotiation scenario.
// It takes the student's negotiation message as input and returns the threat actor's response.
// The response is generated based on the student's message and the negotiation context.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThreatActorResponseInputSchema = z.object({
  studentMessage: z
    .string()
    .describe('The message from the student in the negotiation.'),
  negotiationContext: z
    .string()
    .optional()
    .describe('The current context of the negotiation (optional).'),
});
export type ThreatActorResponseInput = z.infer<typeof ThreatActorResponseInputSchema>;

const ThreatActorResponseOutputSchema = z.object({
  threatActorResponse: z
    .string()
    .describe('The simulated threat actor response to the student.'),
});
export type ThreatActorResponseOutput = z.infer<typeof ThreatActorResponseOutputSchema>;

export async function getThreatActorResponse(
  input: ThreatActorResponseInput
): Promise<ThreatActorResponseOutput> {
  return threatActorResponseFlow(input);
}

const threatActorResponsePrompt = ai.definePrompt({
  name: 'threatActorResponsePrompt',
  input: {
    schema: ThreatActorResponseInputSchema,
  },
  output: {
    schema: ThreatActorResponseOutputSchema,
  },
  prompt: `You are simulating a ransomware threat actor negotiating with a student.

  Your goal is to extract a ransom payment from the student while maintaining a believable persona.
  Adjust your tone and demands based on the student's negotiation tactics and the provided context.

  Current Negotiation Context: {{{negotiationContext}}}

  Student Message: {{{studentMessage}}}

  Generate your response as the threat actor, considering the student's message and the overall negotiation context.  Escalate or de-escalate based on the student's tone and actions. Remember to always demand the ransom.
  Do not include any preamble or explanation, only respond as the threat actor.
  `,
});

const threatActorResponseFlow = ai.defineFlow(
  {
    name: 'threatActorResponseFlow',
    inputSchema: ThreatActorResponseInputSchema,
    outputSchema: ThreatActorResponseOutputSchema,
  },
  async input => {
    const {output} = await threatActorResponsePrompt(input);
    return output!;
  }
);
