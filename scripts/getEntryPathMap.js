import fs from 'fs';
import path from 'path';

function convertToKebabCase(someString) {
  return someString.replace(/\.?([A-Z]+)/g, (x, y) => `-${y.toLowerCase()}`).replace(/^-/, '');
}

function addPrefix(fileName, prefix) {
  return `${prefix}${fileName}`;
}

function getChunkName(fileName, prefix) {
  return addPrefix(path.parse(convertToKebabCase(fileName)).name, prefix);
}

export default ({ dir, prefix = '' }) => {
  const componentNames = fs.readdirSync(dir);

  const entryPathMap = {};

  componentNames.forEach(componentName => {
    if (!fs.lstatSync(`${dir}/${componentName}`).isDirectory()) return;

    entryPathMap[getChunkName(componentName, prefix)] = `${dir}/${componentName}/${componentName}.jsx`;
  });

  return entryPathMap;
};
