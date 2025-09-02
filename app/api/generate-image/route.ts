import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt, imageBase64, mimeType } = await request.json();
        
        const payload = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: imageBase64
                        }
                    }
                ]
            }]
        };
        
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('API key not configured');
        }

        // Get the Referer from the middleware
        const httpReferer = request.headers.get('X-App-Referer');
        if (!httpReferer) {
            // This should not happen if the middleware is configured correctly
            throw new Error('Referer header not set by middleware.');
        }

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': apiKey,
                    'HTTP-Referer': httpReferer,
                },
                body: JSON.stringify(payload)
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Invalid API response:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}