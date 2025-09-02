'use client';

import { Button } from '@/components/ui/button';
import { PromptOption } from '@/lib/types';

interface StyleSelectorProps {
    prompts: PromptOption[];
    selectedPrompt: PromptOption | null;
    onSelectPrompt: (prompt: PromptOption) => void;
}

export function StyleSelector({ prompts, selectedPrompt, onSelectPrompt }: StyleSelectorProps) {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="pb-2">
                <h3 className="text-xl font-semibold">2. Choose a style</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {prompts.map((promptOption, index) => (
                    <Button
                        key={index}
                        onClick={() => onSelectPrompt(promptOption)}
                        variant={selectedPrompt?.title === promptOption.title ? "default" : "outline"}
                        className="justify-start h-auto py-3 text-left"
                    >
                        {promptOption.title}
                    </Button>
                ))}
            </div>
        </div>
    );
}