export interface GalleryImage {
    original: string;
    transformed: string;
    style: string;
    alt: string;
}

export interface PromptOption {
    title: string;
    prompt: string;
}

export interface GenerateImageResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                inlineData?: {
                    mimeType: string;
                    data: string;
                }
            }>
        }
    }>;
    error?: {
        message?: string;
    };
}

export interface GenerateStyleResponse {
    style: string;
    error?: string;
}