import { promises as fs } from 'fs';
import path from 'path';

/**
 * Generates the empty PDF directory tree.
 *
 * @async
 *
 * @param {string} baseFolder - The root folder in which the directory tree is made
 *
 * @throws Will throw an error if <code>fs.mkdir</code> fails for any reason. <p/>
 *
 * @note <code>fs.mkdir</code> doesn't fail if a folder exists.
 */
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
		await fs.mkdir(dirPath, { recursive: true });
	}

}
