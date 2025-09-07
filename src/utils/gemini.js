const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGeminiAPI(prompt) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('No Gemini API key found in environment variables.');
    throw new Error('Gemini API key not configured');
  }

  console.log('Calling Gemini API with prompt:', prompt);

  try {
    const response = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    console.log('Raw Gemini response:', response);

    if (!response.ok) {
      console.error('Gemini API returned status', response.status);
      throw new Error(`Gemini API call failed: ${response.statusText || response.status}`);
    }

    const data = await response.json();
    console.log('Parsed Gemini data:', data);

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) throw new Error('No text returned from Gemini API');

    return result;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

export async function generateSummary(content) {
  const prompt = `Please provide a concise 1-2 sentence summary of the following text:\n\n${content}`;
  return await callGeminiAPI(prompt);
}

export async function suggestTags(content) {
  const prompt = `Based on the following text, suggest 3-5 relevant tags separated by commas:\n\n${content}`;
  const response = await callGeminiAPI(prompt);
  return response.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

export async function checkGrammar(content) {
  const prompt = `Analyze the following text for grammar errors, spelling mistakes, and writing issues. List only the mistakes found (not corrections). If no errors, respond with "No grammar errors found".

Text to check:
${content}

Please list each error clearly, one per line.`;
  
  try {
    const response = await callGeminiAPI(prompt);
    return response.trim();
  } catch (err) {
    console.warn('Failed to check grammar, returning error message.');
    return 'Failed to check grammar. Please try again.';
  }
}

export async function generateGlossary(content) {
  const prompt = `Identify and define the 5 most important or technical terms from the following text. Present them as a simple list in this format:

**Term**: Definition

Text to analyze:
${content}

Focus on key concepts, technical terms, or important vocabulary.`;
  
  try {
    const response = await callGeminiAPI(prompt);
    return response.trim();
  } catch (err) {
    console.warn('Failed to generate glossary, returning error message.');
    return 'Failed to generate glossary. Please try again.';
  }
}

export const aiService = {
  generateSummary,
  suggestTags,
  checkGrammar,
  generateGlossary,
};