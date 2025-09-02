import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sourceDir = path.resolve(process.cwd(), 'public/examples');
const outputDir = path.resolve(process.cwd(), 'public/thumbnails');
const thumbnailSize = 200;

async function createThumbnails() {
  try {
    // 1. Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    console.log(`Output directory '${outputDir}' ready.`);

    // 2. Read files from the source directory
    const files = await fs.readdir(sourceDir);
    console.log(`Found ${files.length} files in '${sourceDir}'.`);

    // 3. Filter only supported image files
    const imageFiles = files.filter(file =>
      /\.(jpe?g|png|webp|gif)$/i.test(file)
    );
    console.log(`Found ${imageFiles.length} image files to process.`);

    // 4. Process each image in parallel
    const processingPromises = imageFiles.map(async file => {
      const sourcePath = path.join(sourceDir, file);
      const outputPath = path.join(outputDir, file);

      try {
        await sharp(sourcePath)
          .resize(thumbnailSize, thumbnailSize, {
            fit: 'cover', // 'cover' crops the image to fill the dimensions, 'inside' fits it within
            position: 'entropy' // Attempts to find the most interesting part of the image to keep
          })
          .toFile(outputPath);
        console.log(`✅ Successfully created thumbnail for: ${file}`);
      } catch (err) {
        console.error(`❌ Error processing ${file}:`, err);
      }
    });

    await Promise.all(processingPromises);

    console.log('\n🎉 Thumbnail generation complete!');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

createThumbnails();