'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { downloadImage } from '@/lib/constants';

interface ResultDisplayProps {
    selectedImage: string | null;
    selectedPrompt: any | null;
    generatedImage: string | null;
    generatedStyle: string | null;
    isLoading: boolean;
    isGeneratingStyle: boolean;
    onGenerate: () => void;
    onOpenPopup?: (imageUrl: string) => void;
}

export function ResultDisplay({
    selectedImage,
    selectedPrompt,
    generatedImage,
    generatedStyle,
    isLoading,
    isGeneratingStyle,
    onGenerate,
    onOpenPopup
}: ResultDisplayProps) {
    return (
        <div className="p-4 md:p-6 space-y-6">
            {generatedImage && (
            <div className="pb-2">
                <h3 className="text-xl font-semibold">3. Your transformed pet</h3>
            </div>
            )}
            <div className="sticky bottom-0 bg-card">
                {isLoading && (
                    <div className="mb-3 p-3 bg-secondary rounded-lg text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">
                                {isGeneratingStyle ? 'Generating style...' : 'Generating image...'}
                            </span>
                        </div>
                    </div>
                )}
                
                <Button
                    onClick={onGenerate}
                    disabled={!selectedImage || !selectedPrompt || isLoading}
                    className="w-full"
                    size="lg"
                >
                    {isLoading ? 'Generation in progress...' : 'Generate Image'}
                </Button>
            </div>

            {generatedImage && (
                <div className="mt-8">
                    <div className="text-center space-y-4 w-full">
                        <div 
                            className="relative w-full aspect-square mx-auto max-w-md cursor-pointer"
                            onClick={() => onOpenPopup && onOpenPopup(generatedImage)}
                        >
                            <Image
                                src={generatedImage}
                                alt="Generated image"
                                fill
                                className="object-cover rounded-2xl shadow-lg"
                            />
                        </div>

                        {generatedStyle ? (
                            <p className="text-sm text-muted-foreground">
                                Style: <span className="font-medium text-foreground">{generatedStyle}</span>
                            </p>
                        ) : null}

                        <Button
                            onClick={() => downloadImage(generatedImage)}
                            variant="default"
                            className="mt-2"
                        >
                            Download Image
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}