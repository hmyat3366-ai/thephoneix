const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const startMarker = '      {/* Architectural Layout */}';
const endMarker = '      {/* Location & Reviews */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log('Markers not found', startIndex, endIndex);
  process.exit(1);
}

const contentToMove = code.substring(startIndex, endIndex);

// Remove content from Home
let newCode = code.substring(0, startIndex) + code.substring(endIndex);

// Find where to insert in About. The card ends with "View Docs</button></div>"
const aboutSectionHeader = 'This section contains confidential operational data, standard operating procedures (SOPs), and internal financial forecasts exclusively for Wyndham Yangon stakeholders.\n                </p>';

const aboutHeaderIndex = newCode.indexOf(aboutSectionHeader);
if (aboutHeaderIndex === -1) {
  console.log('About section not found');
  process.exit(1);
}

const splitIndex = aboutHeaderIndex + aboutSectionHeader.length;

// We will just place the contentToMove right after the paragraph, and remove the dummy grid-2
const grid2Start = newCode.indexOf('<div className="grid-2">', splitIndex);
const grid2End = newCode.indexOf('</div>', newCode.indexOf('</div>', newCode.indexOf('</div>', grid2Start) + 1) + 1) + 6;

if (grid2Start !== -1 && grid2End !== -1) {
  newCode = newCode.substring(0, grid2Start) + '\n' + contentToMove + '\n' + newCode.substring(grid2End);
} else {
  newCode = newCode.substring(0, splitIndex) + '\n' + contentToMove + '\n' + newCode.substring(splitIndex);
}

fs.writeFileSync('src/App.jsx', newCode);
console.log('Success');
