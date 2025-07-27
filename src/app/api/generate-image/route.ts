import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  if (!prompt || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required configuration (prompt or API key)' },
      { status: 400 }
    );
  }

  // This is the correct, direct endpoint for the Imagen model with an API key.
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const payload = {
    instances: [
      {
        prompt: `A breathtaking, ultra-realistic 8k photograph of ${prompt}, Kashmir. Cinematic lighting, serene, majestic, professional landscape photography.`,
      },
    ],
    parameters: { sampleCount: 1 },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google AI API Error:', errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
      const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      return NextResponse.json({ imageUrl });
    } else {
      throw new Error('Image generation returned no data.');
    }
  } catch (error: any) {
    console.error('Error in generate-image route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
