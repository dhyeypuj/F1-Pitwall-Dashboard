/**
 * Script to download official stylized driver numbers from the F1 CDN,
 * convert them to self-contained SVG files, and colorize them in their
 * respective team colors using SVG filters.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'driver-numbers');
const YEAR = 2026;

// 2026 F1 Driver Grid with team, driver codes, and official team colors
const drivers = [
  // McLaren - Orange
  { number: 1,  lastName: 'norris',     team: 'mclaren',      code: 'lannor01', color: '#FF8700' },
  { number: 81, lastName: 'piastri',    team: 'mclaren',      code: 'oscpia01', color: '#FF8700' },
  // Red Bull Racing - Blue
  { number: 3,  lastName: 'verstappen', team: 'redbullracing', code: 'maxver01', color: '#3671C6' },
  { number: 6,  lastName: 'hadjar',     team: 'redbullracing', code: 'isahad01', color: '#3671C6' },
  // Ferrari - Red
  { number: 16, lastName: 'leclerc',    team: 'ferrari',      code: 'chalec01', color: '#E10600' },
  { number: 44, lastName: 'hamilton',   team: 'ferrari',      code: 'lewham01', color: '#E10600' },
  // Mercedes - Teal
  { number: 63, lastName: 'russell',    team: 'mercedes',     code: 'georus01', color: '#00A19B' },
  { number: 12, lastName: 'antonelli',  team: 'mercedes',     code: 'andant01', color: '#00A19B' },
  // Williams - Blue
  { number: 55, lastName: 'sainz',      team: 'williams',     code: 'carsai01', color: '#005AFF' },
  { number: 23, lastName: 'albon',      team: 'williams',     code: 'alealb01', color: '#005AFF' },
  // Aston Martin - British Racing Green
  { number: 14, lastName: 'alonso',     team: 'astonmartin',  code: 'feralo01', color: '#006F62' },
  { number: 18, lastName: 'stroll',     team: 'astonmartin',  code: 'lanstr01', color: '#006F62' },
  // Alpine - Electric Blue
  { number: 10, lastName: 'gasly',      team: 'alpine',       code: 'piegas01', color: '#0090FF' },
  { number: 43, lastName: 'colapinto',  team: 'alpine',       code: 'fracol01', color: '#0090FF' },
  // Haas - Red/Grey
  { number: 31, lastName: 'ocon',       team: 'haasf1team',   code: 'estoco01', color: '#E6002B' },
  { number: 87, lastName: 'bearman',    team: 'haasf1team',   code: 'olibea01', color: '#E6002B' },
  // Racing Bulls - Blue
  { number: 30, lastName: 'lawson',     team: 'racingbulls',  code: 'lialaw01', color: '#6692FF' },
  { number: 41, lastName: 'lindblad',   team: 'racingbulls',  code: 'arvlin01', color: '#6692FF' },
  // Audi - Audi Red
  { number: 27, lastName: 'hulkenberg', team: 'audi',         code: 'nichul01', color: '#F50537' },
  { number: 5,  lastName: 'bortoleto',  team: 'audi',         code: 'gabbor01', color: '#F50537' },
  // Cadillac - Gold
  { number: 11, lastName: 'perez',      team: 'cadillac',     code: 'serper01', color: '#FFD700' },
  { number: 77, lastName: 'bottas',     team: 'cadillac',     code: 'valbot01', color: '#FFD700' },
];

async function fetchAsBase64(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

async function main() {
  console.log('🧹 Cleaning up old SVG and WebP driver numbers...');
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
      if (file.endsWith('.svg') || file.endsWith('.webp')) {
        const filePath = path.join(OUTPUT_DIR, file);
        fs.unlinkSync(filePath);
        console.log(`  Removed old file: ${file}`);
      }
    }
  } else {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('\n🏎️  Downloading, converting & colorizing F1 CDN driver numbers...');
  let successCount = 0;
  
  for (const driver of drivers) {
    const { number, lastName, team, code, color } = driver;
    // URL pattern from official Formula 1 website
    const url = `https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/${YEAR}/${team}/${code}/${YEAR}${team}${code}numberwhitefrless.webp`;
    const destFileName = `${number}-${lastName}.svg`;
    const destPath = path.join(OUTPUT_DIR, destFileName);

    try {
      console.log(`  Processing ${number} - ${lastName.toUpperCase()} (${color})...`);
      const base64Data = await fetchAsBase64(url);
      
      // Create self-contained SVG embedding the WebP and colorizing it using SVG Filters
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 876 742" width="100%" height="100%">
  <defs>
    <!-- SVG Filter to colorize white pixels with the team color -->
    <filter id="colorize-${number}">
      <feFlood flood-color="${color}" result="color" />
      <feComposite in="color" in2="SourceAlpha" operator="in" />
    </filter>
  </defs>
  <image href="data:image/webp;base64,${base64Data}" width="876" height="742" filter="url(#colorize-${number})" />
</svg>`;

      fs.writeFileSync(destPath, svgContent, 'utf-8');
      console.log(`    ✅ Saved colorized SVG as ${destFileName}`);
      successCount++;
    } catch (err) {
      console.error(`    ❌ Failed to process ${destFileName}: ${err.message}`);
    }
  }

  console.log(`\n🏁 Done! Successfully created ${successCount}/${drivers.length} team-colorized SVG files in: ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('Fatal error running converter script:', err);
  process.exit(1);
});
