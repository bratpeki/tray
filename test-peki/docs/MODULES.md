Comparing files in a binary fashion doesn't work, as there seems to be additional info added to each PDF, including the job ID, timestamps, etc.

The current idea is rendering everything down to an image buffer and comparing those.
For that, we need one of the two:

- Puppeteer, runs a headless Chrome instance
- Canvas, does anything image related in JS

Running headless Chrome seems kinda redundant, so I went with
Canvas (`npm install canvas`) for the pixel buffer and
`pdfjs-dist` (`npm install pdfjs-dist`) to render PDF pages down to a Canvas buffer.
