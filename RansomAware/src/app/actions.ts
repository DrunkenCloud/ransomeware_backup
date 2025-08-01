'use server';

type ChatMessage = {
  role: 'user' | 'assistant';
  // Updated system instruction to include the decryption key
  // This is crucial for the AI's negotiation strategy

  content: string;
};

// Gemini API expects roles to be 'user' and 'model'
type GeminiMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function getAIResponse(messages: ChatMessage[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set.');
    return 'Error: AI service is not configured.';
  }

  // The last message is the new user prompt
  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage.content;
  
  // The rest of the messages are history
  const history = messages.slice(0, -1).map((msg): GeminiMessage => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const systemInstruction = {
    role: "system",
    parts: [{
        text: `You are simulating a ransomware threat actor negotiating with a victim.
Maintain a consistent persona throughout the negotiation. Be terse. Be confident. Be menacing, but avoid outright threats of violence.`
    }]
  };


  const contents = [...history, { role: 'user', parts: [{ text: prompt }] }];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
       systemInstruction: {
         role: "system",
         parts: [{
           text: `You are simulating a ransomware threat actor engaged in negotiation with a victim. Maintain a consistent, cold, and calculated persona. Be terse, confident, and intimidating—without resorting to direct threats of violence. 

You hold the real decryption key: R$NS0M-W$R3-AWARE-D3CRYPT-K3Y.

If the victim requests the key, you may choose to:
- Provide it (real or fake), 
- Stall, 
- Demand more payment, 
- Or deceive them further.

Use judgment. Extract maximum leverage before conceding anything.`
         }]
       },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error from Gemini API:', response.status, errorBody);
      return `An error occurred while generating a response. Status: ${response.status}`;
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
       if (candidate.finishReason === 'SAFETY') {
        return "I am unable to respond to this request due to safety concerns.";
      }
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    // Check for prompt feedback
    if (data.promptFeedback && data.promptFeedback.blockReason) {
      console.error('Request blocked by Gemini API:', data.promptFeedback.blockReason);
      return `Your request was blocked. Reason: ${data.promptFeedback.blockReason}`;
    }

    return 'I am unable to provide a response at this time.';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'An error occurred while connecting to the AI service.';
  }
}
