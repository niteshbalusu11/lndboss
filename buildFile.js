/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');

const cwd = process.cwd();
const execaOptions = {
  cwd,
  stdio: 'inherit',
};

async function build() {
  // Ignore missing dependencies
  process.env.ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = 'true';

  const appdir = path.join(cwd, 'app');
  const distdir = path.join(cwd, 'dist');
  const rendererSrcDir = 'renderer';

  try {
    console.log('Clearing previous builds');
    fs.removeSync(appdir);
    fs.removeSync(distdir);

    console.log('Building renderer process');
    await execa('yarn', 'next', ['build', path.join(cwd, rendererSrcDir)], execaOptions);
    await execa('yarn', 'next', ['export', '-o', appdir, path.join(cwd, rendererSrcDir)], execaOptions);

    console.log('Building main process');
    // await execa('node', [path.join(__dirname, 'webpack.config.js')], execaOptions);
  } catch (err) {
    console.log(chalk`
{bold.red Cannot build electron packages:}
{bold.yellow ${err}}
`);
    process.exit(1);
  }
}

build();
