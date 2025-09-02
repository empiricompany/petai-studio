'use client';

import { useState } from 'react';
import { PromptOption, GenerateImageResponse, GenerateStyleResponse } from '@/lib/types';
import { PROMPT_PREFIX, PROMPT_SUFFIX, sleep } from '@/lib/constants';

/**
 * Custom hook for managing image generation
 */
export function useImageGeneration() {
    // States
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<PromptOption | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResultPopupOpen, setIsResultPopupOpen] = useState(false);
    const [isGalleryPopupOpen, setIsGalleryPopupOpen] = useState(false);
    const [generatedStyle, setGeneratedStyle] = useState<string | null>(null);
    const [isGeneratingStyle, setIsGeneratingStyle] = useState(false);
    const [galleryPopupImage, setGalleryPopupImage] = useState<string | null>(null);
    const [promptPrefix] = useState<string>(PROMPT_PREFIX);
    const [promptSuffix] = useState<string>(PROMPT_SUFFIX);

    /**
     * Function to open the popup
     */
    const openResultPopup = () => {
        setIsResultPopupOpen(true);
    };

    /**
     * Function to close the popup
     */
    const closeResultPopup = () => {
        setIsResultPopupOpen(false);
    };

    const closeGalleryPopup = () => {
        setIsGalleryPopupOpen(false);
        setGalleryPopupImage(null);
    };

    /**
     * Function to open the popup with a gallery image
     */
    const openGalleryPopup = (imageUrl: string) => {
        setGalleryPopupImage(imageUrl);
        setIsGalleryPopupOpen(true);
    };

    /**
     * Function to handle image upload
     */
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    setSelectedImage(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Function to generate a random style using the OpenRouter API
     */
    const generateRandomStyle = async () => {
        setIsGeneratingStyle(true);
        try {
            const response = await fetch('/api/generate-style', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // No longer necessary to pass the model, it's read from .env
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json() as GenerateStyleResponse;
            return data.style;
        } catch (error) {
            console.error('Error during style generation:', error);
            return 'Surreal artistic style'; // Fallback style
        } finally {
            setIsGeneratingStyle(false);
        }
    };

    /**
     * Function to call the API with retry
     */
    const callGenerateImageAPI = async (
        promptToUse: string,
        base64Data: string,
        mimeType: string,
        maxRetries = 3
    ) => {
        let lastError: Error | null = null;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                // Calculate exponential delay (1s, 2s, 4s, ...)
                if (attempt > 0) {
                    const delayMs = Math.pow(2, attempt) * 1000;
                    console.log(`Attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms...`);
                    await sleep(delayMs);
                }
                
                // Call the local API route
                const response = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: promptToUse,
                        imageBase64: base64Data,
                        mimeType: mimeType,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} - ${await response.text()}`);
                }

                const data = await response.json() as GenerateImageResponse;
                
                // Log response for debugging
                console.log(`Attempt ${attempt + 1}: Response received:`, data);
                
                // Check if there's an error in the response
                if (data.error) {
                    throw new Error(`API Error: ${data.error.message || JSON.stringify(data.error)}`);
                }
                
                return data;
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error);
                lastError = error instanceof Error ? error : new Error(String(error));
                
                // If it's the last attempt, rethrow the error
                if (attempt === maxRetries - 1) {
                    throw new Error(`All attempts failed. Last error: ${lastError.message}`);
                }
            }
        }
        
        // We should never get here, but TypeScript requires a return
        throw new Error('Unexpected error in API call attempts');
    };

    /**
     * Function to extract the image from the response
     */
    const extractImageFromResponse = (data: GenerateImageResponse) => {
        try {
            // Extract the generated image from the response
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No candidate found in the response');
            }
            
            const candidate = data.candidates[0];
            
            if (!candidate.content || !candidate.content.parts) {
                throw new Error('Invalid candidate structure');
            }
            
            // Find the part containing the image
            const imagePart = candidate.content.parts.find((part: any) => part.inlineData);
            
            if (!imagePart || !imagePart.inlineData) {
                console.error('Response structure:', JSON.stringify(data, null, 2));
                throw new Error('Image not found in the response');
            }
            
            // Create a data URL for the generated image
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        } catch (error) {
            console.error('Error during image extraction:', error);
            console.error('Complete response:', JSON.stringify(data, null, 2));
            throw error;
        }
    };

    /**
     * Main function to generate the image
     */
    const generateImage = async () => {
        if (!selectedImage || !selectedPrompt) return;

        setIsLoading(true);
        setGeneratedStyle(null);

        try {
            // Handle the random AI style case
            let promptToUse = selectedPrompt?.prompt || '';
            
            // Handle the random AI style case (supports both Italian and English title)
            if (selectedPrompt?.title === '✨ Stile casuale AI ✨' || selectedPrompt?.title === '✨ Random AI Style ✨') {
                const randomStyle = await generateRandomStyle();
                setGeneratedStyle(randomStyle);
                promptToUse = randomStyle;
            } else {
                // Check if the prompt already contains the prefix or suffix to avoid duplication
                const hasPrefix = promptToUse.startsWith(promptPrefix);
                const hasSuffix = promptToUse.endsWith(promptSuffix);
                
                // Build the complete prompt avoiding duplications
                if (!hasPrefix) {
                    promptToUse = `${promptPrefix} ${promptToUse}`;
                }
                
                if (!hasSuffix) {
                    promptToUse = `${promptToUse}, ${promptSuffix}`;
                }
            }

            // Extract the base64 part from the data URL
            const base64Data = selectedImage.split(',')[1];

            // Determine the image MIME type
            const mimeType = selectedImage.split(';')[0].split(':')[1];

            // Call the API with retry
            const data = await callGenerateImageAPI(promptToUse, base64Data, mimeType);
            
            // Extract the image from the response
            const imageUrl = extractImageFromResponse(data);
            setGeneratedImage(imageUrl);
            
        } catch (error) {
            console.error("Error during image generation:", error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Return states and functions
    return {
        // States
        selectedImage,
        setSelectedImage,
        selectedPrompt,
        setSelectedPrompt,
        generatedImage,
        setGeneratedImage,
        isLoading,
        isResultPopupOpen,
        isGalleryPopupOpen,
        generatedStyle,
        isGeneratingStyle,
        galleryPopupImage,
        
        // Functions
        openResultPopup,
        closeResultPopup,
        closeGalleryPopup,
        openGalleryPopup,
        handleImageUpload,
        generateImage,
    };
}