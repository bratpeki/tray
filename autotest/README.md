
# Automated testing Node project

## Structure

```
utils/
├── configs
│   ├── html.js                      Sample HTML printing configs
│   ├── image.js                     Sample image printing configs
│   └── pdf.js                       Sample PDF printing configs
├── functions
│   ├── compare
│   │   ├── comparePdfsInFolders.js  Compares corresponding PDFs in two folders (baseline/latest).
│   │   ├── pdf2rgba.js              Makes RGBA buffers from PDF files.
│   │   ├── pdfComp.js               Runs the actual PDF comparison.
│   │   └── rgbaComp.js              Compares RGBA buffers.
│   ├── dir
│   │   └── createDirectoryTree.js   Makes the directory tree for the output prints (html, html/raster, html/vector, etc).
│   ├── format
│   │   └── formatOutput.js          Make the output color coded to show info, pass or fail messages.
│   ├── generate
│   │   └── generatePdfs.js          Generates all the PDFs, watches the directory and moves them into the PDF folder hierarchy.
│   ├── qz
│   │   └── certVer.js               Verify the certificate used during priting.
│   ├── spawn
│   │   └── spawnExpect.js
│   ├── split
│   │   ├── calculateOutPath.js      Returns the subfolder name for storing generated PDFs based on the current OS.
│   │   ├── calculatePdfPrintPath.js Calculates the absolute path where the PDF printer outputs generated PDF files.
│   │   └── osSplitter.js            Get the appropriate item based on the OS.
│   └── watcher
│       └── watchForNewPdf.js        The PDF file watcher.
└── standalone
    ├── generateBaselinePdfs.js      The old script used to make baseline prints.
    ├── getAllSizes.js               A script used to get every size the PDF printer supports.
    └── startTest.js                 Starts the automated tests (PDF generation and comparison).
```

## Conventions

Added just so this code isn't all over the place.

- General
    - Aim for the line length to be less than 100 characters.
- Importing
    - `import { member1, member2 as member2name, ..., memberN } from "module_path.js"` for select members.
    - `import * as module_name from "module_path.js"` for all members.
    - Append `node:` to native Node modules.
    - If the module is on the same path, use `./` so it isn't confused with package modules.
    - Use `"`, not `'`
    - The order of importing should ideally be:
        1. Node native modules
        2. Installed package modules
        3. Our modules (in `utils/`)

