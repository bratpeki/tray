import { promises as fs } from 'fs';
import path from 'path';

async function createNecessaryDirectories() {

  const directoriesToCreate = [

    'assets',

    path.join('assets', 'linux_cupspdfs'),

    path.join('assets', 'linux_cupspdfs', 'pdf', 'vector'),
    path.join('assets', 'linux_cupspdfs', 'pdf', 'raster'),

    path.join('assets', 'linux_cupspdfs', 'img', 'vector'),
    path.join('assets', 'linux_cupspdfs', 'img', 'raster'),

    path.join('assets', 'macos_pdfwriter'),

    path.join('assets', 'macos_pdfwriter', 'pdf', 'vector'),
    path.join('assets', 'macos_pdfwriter', 'pdf', 'raster'),

    path.join('assets', 'macos_pdfwriter', 'img', 'vector'),
    path.join('assets', 'macos_pdfwriter', 'img', 'raster'),

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
