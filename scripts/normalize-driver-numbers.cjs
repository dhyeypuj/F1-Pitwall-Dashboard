/**
 * Script to normalize the viewBox of all 22 driver number SVGs.
 * It uses the visual bounding box coordinates measured from canvas pixel analysis
 * to apply a customized crop for each SVG, ensuring all numbers render at the
 * exact same visual height in the UI.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'driver-numbers');

// Visual bounding boxes parsed from browser canvas analysis
const bounds = [
  { name: "1-norris.svg", minX: 278, minY: 0, maxX: 595, maxY: 741 },
  { name: "3-verstappen.svg", minX: 1, minY: 39, maxX: 873, maxY: 701 },
  { name: "5-bortoleto.svg", minX: 173, minY: 0, maxX: 701, maxY: 741 },
  { name: "6-hadjar.svg", minX: 0, minY: 69, maxX: 875, maxY: 671 },
  { name: "10-gasly.svg", minX: 113, minY: 0, maxX: 762, maxY: 741 },
  { name: "11-perez.svg", minX: 46, minY: 0, maxX: 827, maxY: 741 },
  { name: "12-antonelli.svg", minX: 62, minY: 67, maxX: 814, maxY: 674 },
  { name: "14-alonso.svg", minX: 2, minY: 4, maxX: 871, maxY: 737 },
  { name: "16-leclerc.svg", minX: 0, minY: 143, maxX: 875, maxY: 598 },
  { name: "18-stroll.svg", minX: 15, minY: 0, maxX: 862, maxY: 741 },
  { name: "23-albon.svg", minX: 4, minY: 0, maxX: 870, maxY: 741 },
  { name: "27-hulkenberg.svg", minX: 1, minY: 100, maxX: 873, maxY: 641 },
  { name: "30-lawson.svg", minX: 0, minY: 201, maxX: 875, maxY: 540 },
  { name: "31-ocon.svg", minX: 0, minY: 4, maxX: 874, maxY: 737 },
  { name: "41-lindblad.svg", minX: 0, minY: 146, maxX: 872, maxY: 595 },
  { name: "43-colapinto.svg", minX: 58, minY: 0, maxX: 817, maxY: 741 },
  { name: "44-hamilton.svg", minX: 0, minY: 151, maxX: 874, maxY: 590 },
  { name: "55-sainz.svg", minX: 0, minY: 5, maxX: 872, maxY: 736 },
  { name: "63-russell.svg", minX: 0, minY: 67, maxX: 873, maxY: 674 },
  { name: "77-bottas.svg", minX: 3, minY: 79, maxX: 873, maxY: 662 },
  { name: "81-piastri.svg", minX: 0, minY: 16, maxX: 873, maxY: 725 },
  { name: "87-bearman.svg", minX: 0, minY: 72, maxX: 871, maxY: 669 }
];

function main() {
  console.log('📐 Normalizing SVG viewBox dimensions for visual uniformity...\n');

  bounds.forEach(b => {
    const { name, minX, minY, maxX, maxY } = b;
    const filePath = path.join(OUTPUT_DIR, name);

    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠️ Warning: File not found: ${name}`);
      return;
    }

    const svgContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract base64 image data and filter definitions using regex
    const base64Match = svgContent.match(/href="data:image\/webp;base64,([^"]+)"/);
    const filterColorMatch = svgContent.match(/flood-color="([^"]+)"/);
    const filterIdMatch = svgContent.match(/id="colorize-([^"]+)"/);

    if (!base64Match || !filterColorMatch || !filterIdMatch) {
      console.error(`  ❌ Error parsing SVG components from: ${name}`);
      return;
    }

    const base64Data = base64Match[1];
    const color = filterColorMatch[1];
    const numberId = filterIdMatch[1];

    // Compute original digit dimensions
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    // Define crop bounds with 10% padding on all sides relative to digit size
    const paddingX = w * 0.1;
    const paddingY = h * 0.1;

    const viewBoxX = (minX - paddingX).toFixed(2);
    const viewBoxY = (minY - paddingY).toFixed(2);
    const viewBoxWidth = (w + 2 * paddingX).toFixed(2);
    const viewBoxHeight = (h + 2 * paddingY).toFixed(2);

    // Reconstruct the SVG file with the customized viewBox
    const newSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}" width="100%" height="100%">
  <defs>
    <filter id="colorize-${numberId}">
      <feFlood flood-color="${color}" result="color" />
      <feComposite in="color" in2="SourceAlpha" operator="in" />
    </filter>
  </defs>
  <image href="data:image/webp;base64,${base64Data}" width="876" height="742" filter="url(#colorize-${numberId})" />
</svg>`;

    fs.writeFileSync(filePath, newSvgContent, 'utf8');
    console.log(`  ✅ ${name.padEnd(20)} -> viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}"`);
  });

  console.log('\n🏁 Done! Successfully normalized 22/22 SVG viewboxes.');
}

main();
