// Ran via the parent's package.json, if applicable/needed.
const { execSync } = require('child_process');
// Uses PNPM if the user installs using it, falling back to normal NPM otherwise.
const program = process.env.npm_config_user_agent.startsWith('pnpm') ? 'pnpm' : 'npm';
const cmd = `${program} ${process.env.npm_command}${process.env.NODE_ENV === 'production' || process.env.npm_config_production === 'true' ? ' --production' : ''}`;
console.log('postinstall command will be ran as "%s"', cmd)
execSync(cmd, { stdio: [0, 1, 2] });
