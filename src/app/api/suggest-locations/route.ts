import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { existingLocations } = await request.json();
  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  // The prompt is specifically asking for ONE new location
  const prompt = `Given the following list of unexplored alpine lakes and meadows in Kashmir: ${existingLocations.join(
    ', '
  )}. Suggest just one more similar, non-mainstream, high-altitude lake or meadow in the Kashmir region that is not already on the list.`;

  try {
    const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: 'application/json',
        // The schema correctly expects a single JSON object
        responseSchema: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            description: { type: 'STRING' },
          },
          required: ['name', 'description'],
        },
      },
    };

    // This is the correct, stable endpoint for Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google AI Suggestion Error:', errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
      const suggestedLocation = JSON.parse(
        result.candidates[0].content.parts[0].text
      );
      return NextResponse.json({ suggestedLocation });
    } else {
      throw new Error('Location suggestion failed or returned no data.');
    }
  } catch (err: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    console.error('Error in route:', err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
