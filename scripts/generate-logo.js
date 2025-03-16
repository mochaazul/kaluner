const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.join(__dirname, '../public/kaluner-logo.svg');
const pngPath = path.join(__dirname, '../public/kaluner-logo.png');

// Baca file SVG
const svgBuffer = fs.readFileSync(svgPath);

// Konversi SVG ke PNG dengan resolusi tinggi
sharp(svgBuffer)
  .resize(400, 400) // Ukuran yang lebih besar untuk kualitas yang lebih baik
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('Logo PNG berhasil dibuat!');
  })
  .catch(err => {
    console.error('Error saat membuat logo PNG:', err);
  });
