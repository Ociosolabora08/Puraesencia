import sharp from "sharp";

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF6F0"/>
      <stop offset="55%" stop-color="#FDE8EC"/>
      <stop offset="100%" stop-color="#F8DCE4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1080" cy="120" r="180" fill="#FF5A8F" opacity="0.12"/>
  <circle cx="140" cy="540" r="220" fill="#9B59B6" opacity="0.08"/>
  <circle cx="1000" cy="560" r="120" fill="#FFD93D" opacity="0.14"/>
  <text x="600" y="285" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="110" font-weight="bold" fill="#2E2A26">Pura Esencia</text>
  <text x="600" y="360" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-style="italic" fill="#8A6F55">Cosmética natural, hecha a mano con cariño</text>
  <text x="600" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#FF5A8F">Jabones · Velas · Cremas · Aceites — pequeños lotes</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og-default.png");
console.log("og-default.png creado");
