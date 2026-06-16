import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[1m\x1b[35m[System] Starting F1 Dashboard Services (Backend + Frontend)...\x1b[0m\n');

// Helper to spawn child processes and pipe output
function runProcess(command, args, name, colorCode) {
  const isWindows = process.platform === 'win32';
  
  // On Windows, npm needs to run via shell to resolve the command path
  const child = spawn(command, args, {
    cwd: rootDir,
    shell: isWindows,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      const trimmed = line.trimEnd();
      if (trimmed) {
        console.log(`\x1b[${colorCode}m[${name}]\x1b[0m ${trimmed}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      const trimmed = line.trimEnd();
      if (trimmed) {
        console.error(`\x1b[31m[${name} ERROR]\x1b[0m ${trimmed}`);
      }
    });
  });

  child.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`\x1b[31m[System] ${name} process exited with code ${code}\x1b[0m`);
    } else {
      console.log(`\x1b[35m[System] ${name} process exited cleanly\x1b[0m`);
    }
    process.exit(code || 0);
  });

  return child;
}

// Start local API backend (port 3001) - Color 32 (Green)
const backend = runProcess('node', ['scripts/local-api.js'], 'Backend', '32');

// Start Vite frontend dev server (port 5173) - Color 36 (Cyan)
const frontend = runProcess('npm', ['run', 'dev'], 'Frontend', '36');

// Graceful exit handling on Ctrl+C
const handleExit = () => {
  console.log('\n\x1b[1m\x1b[35m[System] Shutting down all services...\x1b[0m');
  try {
    backend.kill();
  } catch (e) {}
  try {
    frontend.kill();
  } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);
