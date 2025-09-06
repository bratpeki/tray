import { promises as fs } from 'fs';
import path from 'path';

/**
 * Generates the PDF directory tree.
 * @async
 * @param {string} rootPath - The root folder in which the directory tree is made
 */
async function createPdfDirectoryTree(rootPath) {

	const directoriesToCreate = [

		rootPath,

		path.join(rootPath, 'linux_cupspdf'),

		path.join(rootPath, 'linux_cupspdf', 'pdf', 'vector'),
		path.join(rootPath, 'linux_cupspdf', 'pdf', 'raster'),

		path.join(rootPath, 'linux_cupspdf', 'img', 'vector'),
		path.join(rootPath, 'linux_cupspdf', 'img', 'raster'),

		path.join(rootPath, 'linux_cupspdf', 'html', 'vector'),
		path.join(rootPath, 'linux_cupspdf', 'html', 'raster'),

		path.join(rootPath, 'macos_pdfwriter'),

		path.join(rootPath, 'macos_pdfwriter', 'pdf', 'vector'),
		path.join(rootPath, 'macos_pdfwriter', 'pdf', 'raster'),

		path.join(rootPath, 'macos_pdfwriter', 'img', 'vector'),
		path.join(rootPath, 'macos_pdfwriter', 'img', 'raster'),

		path.join(rootPath, 'macos_pdfwriter', 'html', 'vector'),
		path.join(rootPath, 'macos_pdfwriter', 'html', 'raster'),

	];

	for (const dirPath of directoriesToCreate) {
		try {
			await fs.mkdir(dirPath, { recursive: true });
			console.log(`Ensured directory exists: ${dirPath}`);
		} catch (error) {
			console.error(`Unexpected error for ${dirPath}: ${error.message}`);
		}
	}

}

createPdfDirectoryTree('baseline');
