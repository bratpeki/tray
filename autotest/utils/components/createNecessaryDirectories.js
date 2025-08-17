import { promises as fs } from 'fs';
import path from 'path';

async function createNecessaryDirectories() {

	const directoriesToCreate = [

		'baseline',

		path.join('baseline', 'linux_cupspdf'),

		path.join('baseline', 'linux_cupspdf', 'pdf', 'vector'),
		path.join('baseline', 'linux_cupspdf', 'pdf', 'raster'),

		path.join('baseline', 'linux_cupspdf', 'img', 'vector'),
		path.join('baseline', 'linux_cupspdf', 'img', 'raster'),

		path.join('baseline', 'linux_cupspdf', 'html', 'vector'),
		path.join('baseline', 'linux_cupspdf', 'html', 'raster'),

		path.join('baseline', 'macos_pdfwriter'),

		path.join('baseline', 'macos_pdfwriter', 'pdf', 'vector'),
		path.join('baseline', 'macos_pdfwriter', 'pdf', 'raster'),

		path.join('baseline', 'macos_pdfwriter', 'img', 'vector'),
		path.join('baseline', 'macos_pdfwriter', 'img', 'raster'),

		path.join('baseline', 'macos_pdfwriter', 'html', 'vector'),
		path.join('baseline', 'macos_pdfwriter', 'html', 'raster'),

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
