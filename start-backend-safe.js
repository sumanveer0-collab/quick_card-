/**
 * start-backend-safe.js
 * Starts the QuickCard backend safely:
 * - Checks if port 3001 is already in use (backend already running)
 * - If running: exits cleanly (no duplicate process)
 * - If not running: starts bootstrap.js
 *
 * Usage: node start-backend-safe.js
 */

const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));   // port taken = already running
    server.once('listening', () => {
      server.close();
      resolve(false);  // port free = not running
    });
    server.listen(port, '127.0.0.1');
  });
}

async function main() {
  const port = parseInt(process.env.PORT || '3001', 10);

  console.log(`\n🔍 Checking if backend is already running on port ${port}...`);
  const running = await isPortInUse(port);

  if (running) {
    console.log(`✅ Backend already running on port ${port} — nothing to do.\n`);
    process.exit(0);
  }

  console.log(`🚀 Starting QuickCard backend...\n`);

  // Start bootstrap.js as a detached process so it survives this script
  const child = spawn('node', [path.join(__dirname, 'bootstrap.js')], {
    detached: false,
    stdio: 'inherit',
    cwd: __dirname,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Backend exited with code ${code}`);
      process.exit(code);
    }
  });

  // Forward signals
  process.on('SIGINT',  () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

main().catch(err => {
  console.error('Startup error:', err.message);
  process.exit(1);
});
