const fs = require('fs');
const path = require('path');

const openNextDir = path.join(__dirname, '..', '.open-next');

// Rename worker.js to _worker.js
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDst = path.join(openNextDir, '_worker.js');

if (fs.existsSync(workerSrc)) {
  fs.renameSync(workerSrc, workerDst);
  console.log('Renamed worker.js to _worker.js');
}

// Copy assets to root of .open-next for Cloudflare Pages
const assetsDir = path.join(openNextDir, 'assets');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(assetsDir)) {
  copyRecursive(assetsDir, openNextDir);
  console.log('Copied assets to .open-next root');
}

console.log('Cloudflare Pages preparation complete!');
