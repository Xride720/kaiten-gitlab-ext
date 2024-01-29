// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');
const execSync = require('child_process').execSync;

const src = (str) => `./src${str ? '/' + str : ''}`;
const dist = (str) => `./dist${str ? '/' + str : ''}`; 

function changeStartFile(fileName) {
  let startFile = fs.readFileSync(dist(fileName));
  const startFileArr = startFile.toString().split("\n");
  fs.writeFileSync(dist(fileName), startFileArr.slice(0, startFileArr.length - 2).join("\n"));
}

function generate() {
  // if (fs.existsSync(dist())) fs.rmSync(dist(), { recursive:  true });
  execSync('tsc --build --clean && tsc');

  changeStartFile('index.js');

  const manifest = fs.readFileSync(src('manifest.json'));
  fs.writeFileSync(dist('manifest.json'), manifest);
  fs.copySync(src('icons'), dist('icons'), { override: true, recursive: true });
  fs.copySync(src('popup'), dist('popup'), { override: true, recursive: true });
}

generate();