'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryImage } from '@/lib/types';

interface GalleryProps {
    examples: GalleryImage[];
    onOpenGalleryPopup?: (imageUrl: string) => void;
}

export function Gallery({ examples, onOpenGalleryPopup }: GalleryProps) {
    // Funzione per derivare il percorso della miniatura dall'originale
    const getThumbnailSrc = (originalSrc: string) => {
        const parts = originalSrc.split('/');
        const filename = parts.pop();
        // Sostituisce la cartella 'examples' con 'thumbnails'
        return `/thumbnails/${filename}`;
    };

    return (
        <div className="mt-16 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Transformation Examples
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examples.map((example, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">{example.style}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-2 gap-1">
                                <div
                                    className="relative aspect-square cursor-pointer"
                                    onClick={() => onOpenGalleryPopup?.(example.original)}
                                >
                                    <Image
                                        src={getThumbnailSrc(example.original)}
                                        alt={`Original image - ${example.alt}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div
                                    className="relative aspect-square cursor-pointer"
                                    onClick={() => onOpenGalleryPopup?.(example.transformed)}
                                >
                                    <Image
                                        src={getThumbnailSrc(example.transformed)}
                                        alt={example.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}