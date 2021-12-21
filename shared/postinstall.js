// Ran via the parent's package.json, if applicable/needed.
const { execSync } = require('child_process');
const cmd = `npm ${process.env.npm_command}${process.env.NODE_ENV === 'production' ? ' --production' : ''}`;
console.log('postinstall command will be ran as "%s"', cmd)
execSync(cmd, { stdio: [0, 1, 2] });
