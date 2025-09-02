import { NextResponse } from 'next/server';

// Prompt configuration
const PROMPT_PREFIX = "Generate a new image of this pet";
const PROMPT_SUFFIX = "the face should not be too covered but visible";

// Style examples to help the LLM generate creative styles
const styleExamples = [
  "in futuristic cyberpunk style with vibrant neon lights",
  "as a superhero with costume, cape, special powers",
  "in the style of Disney animated cartoons",
  "as an astronaut in space",
  "as a pirate with hat, eye patch and pirate ship",
  "as a samurai warrior with traditional armor and katana",
  "in Andy Warhol pop art style",
  "in 8-bit pixel art style as a retro video game character",
  "in artistic watercolor style with fluid brushstrokes",
  "as a futuristic cyborg with robotic parts and LED lights",
];

// Format style examples with prefix and suffix
const formattedStyleExamples = styleExamples.map(style =>
  `${PROMPT_PREFIX} ${style}, ${PROMPT_SUFFIX}`
);

export async function POST(request: Request) {
  try {
    // Verify that the OpenRouter API key and model are configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1';
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Get the Referer from the middleware
    const httpReferer = request.headers.get('X-App-Referer');
    if (!httpReferer) {
      // This should not happen if the middleware is configured correctly
      throw new Error('Referer header not set by middleware.');
    }

    // Build the prompt for the LLM
    const prompt = `
    Generate a creative style to transform a pet photo.

    Here are some examples of creative styles (don't use these exactly, they are just examples, be creative use films styles, art styles, photography styles, etc.):
    ${formattedStyleExamples.join('\n')}

    Generate a completely new style that starts with "${PROMPT_PREFIX}" followed by a description of maximum 30 characters of the style and ends with "${PROMPT_SUFFIX}":
    `;

    // Make the call to the OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': httpReferer,
        'X-Title': 'PetAI Studio'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are an expert in prompt engineering.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated style from the response
    let generatedStyle = data.choices[0]?.message?.content?.trim() || 'Surreal artistic style';

    console.log('Complete generated style:', generatedStyle);
    console.log(prompt);

    // Check if the generated style already contains the prefix or suffix to avoid duplication
    // when it will be used in app/page.tsx
    if (generatedStyle.startsWith(PROMPT_PREFIX) && generatedStyle.includes(PROMPT_SUFFIX)) {
      // The style is already complete, return it as is
      return NextResponse.json({ style: generatedStyle });
    } else {
      // The style might be incomplete, return it without prefix and suffix
      // so they can be added in app/page.tsx
      
      // Remove prefix if present
      if (generatedStyle.startsWith(PROMPT_PREFIX)) {
        generatedStyle = generatedStyle.substring(PROMPT_PREFIX.length).trim();
        // Remove any leading spaces or commas
        generatedStyle = generatedStyle.replace(/^[\s,]+/, '');
      }
      
      // Remove suffix if present
      if (generatedStyle.includes(PROMPT_SUFFIX)) {
        generatedStyle = generatedStyle.replace(`, ${PROMPT_SUFFIX}`, '').trim();
        generatedStyle = generatedStyle.replace(PROMPT_SUFFIX, '').trim();
      }
      
      return NextResponse.json({ style: generatedStyle });
    }
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}