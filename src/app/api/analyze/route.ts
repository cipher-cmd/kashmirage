import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const imageData = body.image;

  if (!imageData) {
    return NextResponse.json(
      { error: 'Image data is required' },
      { status: 400 }
    );
  }

  // Get the secret API key from environment variables. Never hardcode keys.
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  try {
    const base64ImageData = imageData.split(',')[1];

    // Create the request body for Google Vision's landmark detection.
    const requestBody = {
      requests: [
        {
          image: {
            content: base64ImageData,
          },
          features: [
            {
              type: 'LANDMARK_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error:', errorBody);
      throw new Error(`API call failed`);
    }

    const result = await response.json();
    // Get the first landmark found by the AI.
    const landmark = result.responses?.[0]?.landmarkAnnotations?.[0];

    // If no landmark was found, send a helpful message.
    if (!landmark) {
      return NextResponse.json({
        name: 'No landmark found',
        description: 'Could not identify a landmark. Please try another image.',
      });
    }

    // If a landmark is found, send back its name and description.
    return NextResponse.json({
      name: landmark.description || 'AI Analysis',
      description: `A landmark identified with a confidence score of ${landmark.score.toFixed(
        2
      )}.`,
    });
  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
