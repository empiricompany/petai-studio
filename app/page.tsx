'use client';

import { Card } from '@/components/ui/card';
import { ModeToggle } from '@/components/theme-toggle';
import { useImageGeneration } from '@/hooks/use-image-generation';
import { ImageUploader } from '@/components/page/ImageUploader';
import { StyleSelector } from '@/components/page/StyleSelector';
import { ResultDisplay } from '@/components/page/ResultDisplay';
import { Gallery } from '@/components/page/Gallery';
import { availablePrompts, galleryExamples } from '@/lib/constants';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
    const {
        selectedImage,
        setSelectedImage,
        selectedPrompt,
        setSelectedPrompt,
        generatedImage,
        isLoading,
        generatedStyle,
        isGeneratingStyle,
        handleImageUpload,
        generateImage,
    } = useImageGeneration();

    const [popupImage, setPopupImage] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const handleOpenPopup = (imageUrl: string) => {
        setPopupImage(imageUrl);
        setIsImageLoading(true);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setPopupImage(null);
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">🐾</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold">
                                PetAI Studio [beta]
                            </h1>
                        </div>
                        <div>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Transform Your Pet
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Upload a photo of your pet and let artificial intelligence
                        transform it into incredible personalized works of art
                    </p>
                </div>

                <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ImageUploader
                            selectedImage={selectedImage}
                            onImageUpload={handleImageUpload}
                            onImageRemove={() => setSelectedImage(null)}
                        />

                        <StyleSelector
                            prompts={availablePrompts}
                            selectedPrompt={selectedPrompt}
                            onSelectPrompt={setSelectedPrompt}
                        />

                        <ResultDisplay
                            selectedImage={selectedImage}
                            selectedPrompt={selectedPrompt}
                            generatedImage={generatedImage}
                            generatedStyle={generatedStyle}
                            isLoading={isLoading}
                            isGeneratingStyle={isGeneratingStyle}
                            onGenerate={generateImage}
                            onOpenPopup={() => generatedImage && handleOpenPopup(generatedImage)}
                        />
                    </div>
                </Card>

                <Gallery
                    examples={galleryExamples}
                    onOpenGalleryPopup={handleOpenPopup}
                />
            </main>

            <footer className="bg-card/80 backdrop-blur-sm border-t border-border py-6">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2025 PetAI Studio. All rights reserved.</p>
                    <p className="mt-1">Powered by Next.js, Tailwind CSS e Gemini API.</p>
                </div>
            </footer>

            <Dialog open={isPopupOpen} onOpenChange={(isOpen) => !isOpen && handleClosePopup()}>
                <DialogContent className="w-auto max-w-[90vw] max-h-[90vh] p-0">
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>
                    <div className="relative flex items-center justify-center">
                        {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {popupImage && (
                            <img
                                src={popupImage}
                                alt="Popup image"
                                className={`max-w-full max-h-[90vh] object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={handleImageLoad}
                                onError={handleImageLoad}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
