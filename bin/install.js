#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const { name: pkgName, version } = require('../package.json');

const INSTALL_DIR = path.join(os.homedir(), '.claude', 'setup', 'claude-setup');
const COMMANDS_DIR = path.join(os.homedir(), '.claude', 'commands');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const META_FILE = path.join(INSTALL_DIR, 'meta.json');
const PLUGINS_CACHE_DIR = path.join(os.homedir(), '.claude', 'plugins', 'cache');

const GUIDE_FILES = [
  'claude-setup-instructions.md',
  'claude-setup-preflight.md',
  'claude-setup-graph.md',
  'claude-setup-graph-summary.md',
  'claude-setup-coverage.md',
  'claude-setup-workflow.md',
  'claude-setup-workflow-investigation.md',
  'claude-setup-workflow-agents.md',
  'claude-setup-rules.md',
  'claude-setup-skills.md',
  'claude-setup-agents.md',
  'claude-setup-commands.md',
  'claude-setup-hooks.md',
  'claude-setup-claude-md.md',
  'claude-setup-memory.md',
];

const COMMAND_FILES = ['setup-claude.md', 'code.md', 'quick.md', 'investigate.md'];

function isSuperpowersInstalled() {
  if (!fs.existsSync(PLUGINS_CACHE_DIR)) return false;
  try {
    const marketplaces = fs.readdirSync(PLUGINS_CACHE_DIR, { withFileTypes: true });
    return marketplaces.some(
      (entry) => entry.isDirectory() && fs.existsSync(path.join(PLUGINS_CACHE_DIR, entry.name, 'superpowers')),
    );
  } catch {
    return false;
  }
}

function parseFrontmatter(content, label) {
  const lines = content.split(/\r?\n/);
  if (lines[0].trim() !== '---') {
    throw new Error(`${label}: missing opening '---' frontmatter fence`);
  }
  const end = lines.indexOf('---', 1);
  if (end === -1) {
    throw new Error(`${label}: missing closing '---' frontmatter fence`);
  }
  const fm = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) {
      throw new Error(`${label}: invalid frontmatter at line ${i + 1}: "${line}"`);
    }
    fm[match[1].trim()] = match[2].trim();
  }
  for (const required of ['name', 'description']) {
    if (!fm[required]) {
      throw new Error(`${label}: frontmatter missing required field '${required}'`);
    }
  }
  return fm;
}

function validateTemplates(files, dir) {
  const errors = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`missing template: ${filePath}`);
      continue;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      parseFrontmatter(content, file);
    } catch (err) {
      errors.push(err.message);
    }
  }
  if (errors.length) {
    console.error('\nTemplate validation failed:');
    for (const err of errors) console.error(`  ✗ ${err}`);
    throw new Error('Refusing to install with invalid templates.');
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function printStatus() {
  if (!fs.existsSync(INSTALL_DIR)) {
    console.log('claude-setup-kit: not installed.');
    console.log(`Run \`npx ${pkgName}\` to install v${version}.`);
    return;
  }

  const meta = readMeta();
  console.log(`\nclaude-setup-kit status`);
  console.log(`  Package version (current): v${version}`);
  if (meta) {
    const marker = meta.version !== version ? '  ← update available' : '';
    console.log(`  Installed version:         v${meta.version}${marker}`);
    console.log(`  Installed at:              ${meta.installed_at}`);
  } else {
    console.log(`  Installed version:         unknown (legacy install — no meta.json)`);
  }

  const installed = fs
    .readdirSync(INSTALL_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();
  console.log(`  Guide files:               ${installed.length} (${INSTALL_DIR})`);
  for (const f of installed) console.log(`    • ${f}`);

  const commands = fs.existsSync(COMMANDS_DIR)
    ? fs.readdirSync(COMMANDS_DIR).filter((f) => COMMAND_FILES.includes(f)).sort()
    : [];
  console.log(`  Installed commands:        ${commands.length}`);
  for (const f of commands) console.log(`    • /${f.replace(/\.md$/, '')}`);

  if (!isSuperpowersInstalled()) {
    console.log(`\n⚠  superpowers plugin not detected.`);
    console.log(`   For the best experience, install it: https://github.com/obra/superpowers`);
  }
}

async function install({ dryRun, assumeYes }) {
  validateTemplates(GUIDE_FILES, TEMPLATES_DIR);
  validateTemplates(COMMAND_FILES, TEMPLATES_DIR);

  const alreadyInstalled = fs.existsSync(INSTALL_DIR);

  if (!dryRun && alreadyInstalled) {
    if (assumeYes) {
      console.log(`claude-setup-kit is already installed. Updating to v${version} (--yes).`);
    } else {
      const answer = await prompt(`claude-setup-kit is already installed. Update to v${version}? (y/n): `);
      if (answer.toLowerCase() !== 'y') {
        console.log('Skipped. No changes made.');
        return;
      }
    }
  }

  const installPath = INSTALL_DIR.split(path.sep).join('/');
  const installedAt = new Date().toISOString();

  const plannedWrites = [];

  for (const file of GUIDE_FILES) {
    plannedWrites.push({
      kind: 'guide',
      src: path.join(TEMPLATES_DIR, file),
      dest: path.join(INSTALL_DIR, file),
    });
  }

  for (const cmd of COMMAND_FILES) {
    plannedWrites.push({
      kind: 'command',
      src: path.join(TEMPLATES_DIR, cmd),
      dest: path.join(COMMANDS_DIR, cmd),
    });
  }

  const metaContent =
    JSON.stringify(
      {
        package: pkgName,
        version,
        installed_at: installedAt,
        commands: COMMAND_FILES.map((c) => c.replace(/\.md$/, '')),
      },
      null,
      2,
    ) + '\n';

  plannedWrites.push({
    kind: 'meta',
    dest: META_FILE,
    content: metaContent,
  });

  if (dryRun) {
    console.log(`\nDry-run (no files written) — would install v${version}:\n`);
    console.log(`  mkdir -p ${INSTALL_DIR}`);
    console.log(`  mkdir -p ${COMMANDS_DIR}`);
    for (const w of plannedWrites) {
      const label = w.kind === 'guide' ? 'copy  ' : w.kind === 'command' ? 'render' : 'write ';
      const base = w.src ? path.basename(w.src) : path.basename(w.dest);
      console.log(`  ${label} ${base.padEnd(36)} → ${w.dest}`);
    }
    console.log(`\nRerun without --dry-run to install.`);
    return;
  }

  fs.mkdirSync(INSTALL_DIR, { recursive: true });
  fs.mkdirSync(COMMANDS_DIR, { recursive: true });

  for (const w of plannedWrites) {
    if (w.kind === 'guide') {
      fs.copyFileSync(w.src, w.dest);
    } else if (w.kind === 'command') {
      const template = fs.readFileSync(w.src, 'utf8');
      const rendered = template
        .replace(/\{\{INSTALL_PATH\}\}/g, installPath)
        .replace(/\{\{KIT_VERSION\}\}/g, version)
        .replace(/\{\{KIT_PACKAGE\}\}/g, pkgName);
      fs.writeFileSync(w.dest, rendered);
    } else if (w.kind === 'meta') {
      fs.writeFileSync(w.dest, w.content);
    }
  }

  console.log(`\n✓ v${version} installed`);
  console.log(`✓ Guide files: ${INSTALL_DIR}`);
  for (const cmd of COMMAND_FILES) {
    console.log(`✓ Command: ${path.join(COMMANDS_DIR, cmd)}`);
  }

  if (!isSuperpowersInstalled()) {
    console.log('\n⚠  superpowers plugin not detected.');
    console.log('   For the best experience, install it: https://github.com/obra/superpowers');
  }

  console.log('\nDone! Open Claude Code in any repo:');
  console.log('  • /setup-claude — one-time repo setup');
  console.log('  • /code — freeform end-to-end development workflow (full 10-phase, ~100–250k tokens)');
  console.log('  • /quick — lean workflow for small changes (skips brainstorming + agent review, ~40–70k tokens)');
  console.log('  • /investigate [symptom] — read-only research, produces a findings report');
}

function printHelp() {
  console.log(`Usage: ${pkgName} [command] [options]`);
  console.log('');
  console.log('Commands:');
  console.log('  (default)    Install or update the kit');
  console.log('  status       Show installed version and files without changing anything');
  console.log('');
  console.log('Options:');
  console.log('  --dry-run    Print planned file writes without touching the filesystem');
  console.log('  --yes, -y    Non-interactive mode — auto-confirm the update prompt');
  console.log('               (also enabled by CLAUDE_SETUP_KIT_YES=1 or when stdin is not a TTY)');
  console.log('  --help, -h   Show this help');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    rl.close();
    return;
  }

  if (args[0] === 'status') {
    printStatus();
    rl.close();
    return;
  }

  const dryRun = args.includes('--dry-run');
  const assumeYes =
    args.includes('--yes') ||
    args.includes('-y') ||
    process.env.CLAUDE_SETUP_KIT_YES === '1' ||
    !process.stdin.isTTY;
  try {
    await install({ dryRun, assumeYes });
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  rl.close();
  console.error('Error:', err.message);
  process.exit(1);
});
