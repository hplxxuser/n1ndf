// api/negotiate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cartValue, pastPurchases, sessionTime, userMessage } = req.body;

  // OpenRouter API details
  const apiKey = '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';
  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

  // Define the prompt for negotiation, including the user's message
  const prompt = `
    You are an AI negotiation assistant for an e-commerce platform called "DhamakaDeals". 
    Based on the following customer data and their message, suggest a discount offer between a floor and ceiling value:
    - Cart Value: $${cartValue}
    - Past Purchases: ${pastPurchases}
    - Session Time: ${sessionTime} seconds
    - User's Message: "${userMessage}"
    
    Rules:
    - Floor discount: minimum 5% or 5% of cart value, whichever is higher
    - Ceiling discount: maximum 20% or 10% of cart value, whichever is lower
    - Respond naturally to the user's message and include an offer in this format: "How about a X% discount?"
    - Keep the tone friendly and persuasive.
    - Return only what the user would be seeing in the chat interface.
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free', // Free-tier model added here
        messages: [
          { role: 'system', content: 'You are a negotiation expert.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150 // Enough for a natural response
      })
    });

    const data = await response.json();
    console.log('OpenRouter API response:', data);
    const reply = data.choices[0].message.content.trim();

    // Extract floor and ceiling for consistency
    const floor = Math.max(5, cartValue * 0.05);
    const ceiling = Math.min(20, cartValue * 0.1);

    res.status(200).json({
      message: reply,
      floor,
      ceiling
    });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ message: 'Sorry, something went wrong!' });
  }
}