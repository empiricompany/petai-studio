'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
    selectedImage: string | null;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onImageRemove: () => void;
}

export function ImageUploader({ selectedImage, onImageUpload, onImageRemove }: ImageUploaderProps) {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="pb-4">
                <h3 className="text-xl font-semibold">1. Upload your pet&apos;s photo</h3>
            </div>

            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                {selectedImage ? (
                    <div className="space-y-4">
                        <div className="relative w-full aspect-square mx-auto max-w-md">
                            <Image
                                src={selectedImage}
                                alt="Uploaded pet"
                                fill
                                className="object-cover rounded-2xl shadow-lg"
                            />
                        </div>

                        <Button
                            onClick={onImageRemove}
                            variant="ghost"
                            size="sm"
                        >
                            Change image
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <span className="text-3xl">📸</span>
                        </div>
                        <div>
                            <div className="flex flex-col items-center">
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageUpload}
                                    className="hidden"
                                />
                                <label htmlFor="file-upload">
                                    <Button variant="link" className="p-0 h-auto cursor-pointer" asChild>
                                        <span>Click to upload</span>
                                    </Button>
                                </label>
                                <p className="text-muted-foreground text-sm mt-2">
                                    PNG, JPG up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}