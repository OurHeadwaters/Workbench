const { execFileSync } = require('child_process');
const path = require('path');

const input = `file://${path.resolve(__dirname, 'index.html')}`;
const output = path.resolve(
  __dirname,
  'Ryan-Gizmos-Gadgets-123-Capacity-Plan.pdf'
);

try {
  execFileSync('chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    `--print-to-pdf=${output}`,
    input,
  ], { stdio: 'inherit' });
  console.log(`PDF generated successfully: ${output}`);
} catch (error) {
  console.error('Error generating PDF:', error.message);
  process.exit(1);
}
