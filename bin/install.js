#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const INSTALL_DIR = path.join(os.homedir(), '.claude', 'setup', 'claude-setup');
const COMMANDS_DIR = path.join(os.homedir(), '.claude', 'commands');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const GUIDE_FILES = [
  'claude-setup-instructions.md',
  'claude-setup-workflow.md',
  'claude-setup-rules.md',
  'claude-setup-skills.md',
  'claude-setup-agents.md',
  'claude-setup-claude-md.md',
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  const alreadyInstalled = fs.existsSync(INSTALL_DIR);

  if (alreadyInstalled) {
    const answer = await prompt('claude-setup-kit is already installed. Update to the latest version? (y/n): ');
    if (answer.toLowerCase() !== 'y') {
      console.log('Skipped. No changes made.');
      rl.close();
      process.exit(0);
    }
  }

  fs.mkdirSync(INSTALL_DIR, { recursive: true });
  fs.mkdirSync(COMMANDS_DIR, { recursive: true });

  for (const file of GUIDE_FILES) {
    fs.copyFileSync(path.join(TEMPLATES_DIR, file), path.join(INSTALL_DIR, file));
  }

  // Generate command files with the correct absolute paths for this machine
  const installPath = INSTALL_DIR.split(path.sep).join('/'); // normalize to forward slashes
  const COMMAND_FILES = ['setup-claude.md', 'code.md'];
  for (const cmd of COMMAND_FILES) {
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, cmd), 'utf8');
    const generated = template.replace(/\{\{INSTALL_PATH\}\}/g, installPath);
    fs.writeFileSync(path.join(COMMANDS_DIR, cmd), generated);
  }

  console.log(`\n✓ Guide files installed to: ${INSTALL_DIR}`);
  for (const cmd of COMMAND_FILES) {
    console.log(`✓ Command installed to: ${path.join(COMMANDS_DIR, cmd)}`);
  }
  console.log('\nDone! Open Claude Code in any repo:');
  console.log('  • /setup-claude — one-time repo setup');
  console.log('  • /code — run the end-to-end development workflow');
  rl.close();
}

main().catch((err) => {
  rl.close();
  console.error('Error:', err.message);
  process.exit(1);
});
