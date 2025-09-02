import { GalleryImage, PromptOption } from './types';

export const PROMPT_PREFIX = "Generate a new image of this pet";

export const PROMPT_SUFFIX = "be sure the face should not be too covered but visible";

export const galleryExamples: GalleryImage[] = [
    {
        original: '/examples/dog1-original.jpg',
        transformed: '/examples/dog1-cyberpunk.png',
        style: 'Cyberpunk with neon lights',
        alt: 'Dog transformed in cyberpunk style'
    },
    {
        original: '/examples/cat1-original.jpeg',
        transformed: '/examples/cat1-renaissance.png',
        style: 'Renaissance portrait',
        alt: 'Cat transformed in renaissance style'
    },
    {
        original: '/examples/dog2-original.jpg',
        transformed: '/examples/dog2-astronaut.png',
        style: 'Astronaut in space',
        alt: 'Dog transformed into an astronaut'
    },
    {
        original: '/examples/cat2-original.jpg',
        transformed: '/examples/cat2-disney.png',
        style: 'Disney Cartoon',
        alt: 'Cat transformed in Disney cartoon style'
    },
    {
        original: '/examples/dog3-original.jpeg',
        transformed: '/examples/dog3-pirate.png',
        style: 'Caribbean Pirate',
        alt: 'Dog transformed into a pirate'
    },
    {
        original: '/examples/cat3-original.jpeg',
        transformed: '/examples/cat3-samurai.png',
        style: 'Samurai Warrior',
        alt: 'Cat transformed into a samurai'
    }
];

export const availablePrompts: PromptOption[] = [
    {
        title: "✨ Random AI Style ✨",
        prompt: "random_ai_style"
    },
    {
        title: "Harry Potter Wizard",
        prompt: "as a wizard from Harry Potter with robe, hat and magic wand"
    },
    {
        title: "Eating a nano-banana",
        prompt: "eating a fancy nano banana well dressed in fancy restaurant" 
    },
    {
        title: "Riding a skateboard",
        prompt: "riding a skateboard in a skatepark"
    },
    {
        title: "Riding a bicycle",
        prompt: "riding a bicycle in a park"
    },
    {
        title: "Toy Figurine",
        prompt: "as a plastic toy figurine in a kid's bedroom"
    },
    {
        title: "Cyberpunk with neon lights",
        prompt: "in futuristic cyberpunk style with vibrant neon lights"
    },
    {
        title: "Superhero",
        prompt: "as a superhero with costume, cape, special powers"
    },
    {
        title: "Disney Cartoon",
        prompt: "in the style of Disney animated cartoons"
    },
    {
        title: "Renaissance Portrait",
        prompt: "in a Renaissance portrait in the style of the great masters"
    },
    {
        title: "Astronaut in space",
        prompt: "as an astronaut in space"
    },
    {
        title: "Caribbean Pirate",
        prompt: "as a pirate with hat, eye patch and pirate ship"
    },
    {
        title: "Medieval Prince/Princess",
        prompt: "as a medieval prince or princess with crown and cape"
    },
    {
        title: "Noir Detective",
        prompt: "in black and white film noir style with fedora hat and trench coat"
    },
    {
        title: "Samurai Warrior",
        prompt: "as a samurai warrior with traditional armor and katana"
    },
    {
        title: "Vaporwave/Synthwave",
        prompt: "in vaporwave/synthwave style with pink and blue neon colors"
    },
    {
        title: "8-bit Pixel Art",
        prompt: "in 8-bit pixel art style as a retro video game character"
    },
    {
        title: "Artistic Watercolor",
        prompt: "in artistic watercolor style with fluid brushstrokes"
    },
    {
        title: "Victorian Steampunk",
        prompt: "in Victorian steampunk style with gears and lens goggles"
    },
    {
        title: "Art Nouveau",
        prompt: "in Art Nouveau style with sinuous lines and floral patterns"
    },
    {
        title: "Wes Anderson Film",
        prompt: "as a character in a Wes Anderson film with pastel colors"
    },
    {
        title: "Monet Impressionism",
        prompt: "in Claude Monet's impressionist style"
    },
    {
        title: "Ancient Egypt",
        prompt: "in ancient Egyptian style as an Egyptian deity"
    },
    {
        title: "Pop Art",
        prompt: "in Andy Warhol pop art style"
    },
    {
        title: "Futuristic Cyborg",
        prompt: "as a futuristic cyborg with robotic parts and LED lights"
    }
];

export const downloadImage = (imageUrl: string, filename?: string) => {
    if (!filename) {
        const now = new Date();
        
        const formattedDate = now.toISOString()
            .replace(/T/, '_')
            .replace(/\..+/, '')
            .replace(/:/g, '-');
        
        let extension = '.png';
        
        if (imageUrl.startsWith('data:')) {
            const mimeType = imageUrl.split(';')[0].split(':')[1];
            if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
                extension = '.jpg';
            } else if (mimeType === 'image/png') {
                extension = '.png';
            } else if (mimeType === 'image/gif') {
                extension = '.gif';
            } else if (mimeType === 'image/webp') {
                extension = '.webp';
            }
        } 
        else if (imageUrl.includes('.')) {
            const urlExtension = imageUrl.split('.').pop()?.toLowerCase();
            if (urlExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(urlExtension)) {
                extension = `.${urlExtension}`;
            }
        }
        
        filename = `petai-${formattedDate}${extension}`;
    }
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));