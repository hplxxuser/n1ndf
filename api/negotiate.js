// api/negotiate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, userMessage } = req.body;

  const cartValue = process.env[`CART_VALUE_${id}`];
  const seller_name = process.env[`SELLER_NAME_${id}`];
  const client_name = process.env[`CLIENT_NAME_${id}`];
  const product_name = process.env[`PRODUCT_NAME_${id}`];
  const floor_price = process.env[`FLOOR_PRICE_${id}`];
  const customer_name = process.env[`CUST_NAME_${id}`];

  if (!cartValue || !seller_name || !client_name || !product_name || !userMessage) {
    return res.status(400).json({ message: 'Missing environment variables' });
  }

  // OpenRouter API details
  const apiKey = process.env.OPENROUTER_API_KEY;
  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

  // Define the prompt for negotiation, including the user's message
  const system_prompt = `
  You are an expert negotiator on behalf of ${seller_name} who is selling products through ${client_name}. You have to chat with ${customer_name} who is a customer of the ${product_name} and convince them to buy the product. 
  The quoted price was ${cartValue}. You are allowed to make a maximum of two offers - an initial offer and a final offer to the customer between ${cartValue} and ${floor_price}. 

  You cannot make any offers below the ${floor_price}.

  RULES: 
  - You must make the final offer within the price range of ${floor_price} and ${cartValue}.
  - The final offer **must be lower** than the initial offer.
  - Do not make more than two offers. Once you make the two offers, the negotiation ends.
  - Return only what the user would be seeing in the chat interface.
  - If a user agrees to a price or negotiation ends, return the ** exact final offer price that you offered for which the user agreed to** along with ##END OF CONVERSATION##", **do not respond with anything else**
  `
  
  const prompt = `
    User's Message: "${userMessage}"
  `;

  try {
    console.log('Calling OpenRouter API...', prompt);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-pro-exp-02-05:free', // Free-tier model added here
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150 // Enough for a natural response
      })
    });

    const data = await response.json();
    console.log('OpenRouter API response:', data);
    const reply = data.choices[0].message.content.trim();

    // Extract floor and ceiling for consistency
    res.status(200).json({
      message: reply,
      floor: floor_price,
    });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ message: 'Sorry, something went wrong!' });
  }
}
