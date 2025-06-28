Comparing files in a binary fashion doesn't work, as there seems to be additional info added to each PDF, including the job ID, timestamps, etc.

The current idea is rendering everything down to an image buffer and comparing those.
For that, we need one of the two:

- Puppeteer, runs a headless Chrome instance
- Canvas, does anything image related in JS

Running headless Chrome seems kinda redundant, so I went with
Canvas (`npm install canvas`) for the pixel buffer and
`pdfjs-dist` (`npm install pdfjs-dist`) to render PDF pages down to a Canvas buffer.

ChatGPT generated this bit of code, which I'm basing the logic on:

```javascript
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist');

const pdfPath = path.join(__dirname, 'assets', 'pdf_sample.pdf');

(async () => {
	const data = new Uint8Array(fs.readFileSync(pdfPath));

	const pdf = await pdfjsLib.getDocument({ data }).promise;
	const page = await pdf.getPage(1);

	const viewport = page.getViewport({ scale: 2.0 });

	const canvas = createCanvas(viewport.width, viewport.height);
	const context = canvas.getContext('2d');

	await page.render({
		canvasContext: context,
		viewport: viewport
	}).promise;

	// Save to PNG
	const out = fs.createWriteStream('page1.png');
	const stream = canvas.createPNGStream();
	stream.pipe(out);

	out.on('finish', () => console.log('Page rendered to page1.png'));
})();
```

---

Scratch that, `pdfjs-dist` works with Node via legacy ESM modules which are hell.
