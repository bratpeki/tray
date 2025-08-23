import { promises as fs } from 'fs';
import path from 'path';

export async function createDirectoryTree(baseFolder) {

	const directoriesToCreate = [

		baseFolder,

		path.join(baseFolder, 'linux_cupspdf'),

		path.join(baseFolder, 'linux_cupspdf', 'pdf', 'vector'),
		path.join(baseFolder, 'linux_cupspdf', 'pdf', 'raster'),

		path.join(baseFolder, 'linux_cupspdf', 'img', 'vector'),
		path.join(baseFolder, 'linux_cupspdf', 'img', 'raster'),

		path.join(baseFolder, 'linux_cupspdf', 'html', 'vector'),
		path.join(baseFolder, 'linux_cupspdf', 'html', 'raster'),

		path.join(baseFolder, 'macos_pdfwriter'),

		path.join(baseFolder, 'macos_pdfwriter', 'pdf', 'vector'),
		path.join(baseFolder, 'macos_pdfwriter', 'pdf', 'raster'),

		path.join(baseFolder, 'macos_pdfwriter', 'img', 'vector'),
		path.join(baseFolder, 'macos_pdfwriter', 'img', 'raster'),

		path.join(baseFolder, 'macos_pdfwriter', 'html', 'vector'),
		path.join(baseFolder, 'macos_pdfwriter', 'html', 'raster'),

	];

	for (const dirPath of directoriesToCreate) {
		try { await fs.mkdir(dirPath, { recursive: true }); }
		catch (error) { console.error(`Error creating directory ${dirPath}:`, error.message); }
	}

}

