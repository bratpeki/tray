import { promises as fs } from 'fs';
import path from 'path';

async function createNecessaryDirectories() {

  const directoriesToCreate = [
    'assets',
    path.join('assets', 'linux_cupspdfs'),
    path.join('assets', 'linux_cupspdfs', 'vector'),
    path.join('assets', 'linux_cupspdfs', 'raster'),
    path.join('assets', 'macos_pdfwriter'),
    path.join('assets', 'macos_pdfwriter', 'vector'),
    path.join('assets', 'macos_pdfwriter', 'raster'),
  ];

  for (const dirPath of directoriesToCreate) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Successfully ensured directory exists: ${dirPath}`);
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error.message);
    }
  }

}

createNecessaryDirectories();