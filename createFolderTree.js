const fs = require('fs');
const path = require('path');

sourcePath = path.join(__dirname, 'ff');
distPath = path.join(__dirname, 'dist');
isDeleteSource = false;

const isDir = function (path) {
  return fs.statSync(path).isDirectory()
};

const isFile = function (path) {
  return fs.statSync(path).isFile()
};

const parseDir = function (levelPath, distPath, isDelete) {
  const elements = fs.readdirSync(levelPath);

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath)
  }

  elements.forEach(function (element) {
    const newPath = path.join(levelPath, element);
    if (isDir(newPath)) {
      parseDir(newPath, distPath, isDelete)
    }
    if (isFile(newPath)) {
      const firstChar = element[0].toUpperCase();
      const newDistPath = path.join(distPath, firstChar);
      if (!fs.existsSync(newDistPath)) {
        fs.mkdirSync(newDistPath)
      }
      fs.linkSync(newPath, path.join(newDistPath, element));
      if (isDelete && fs.readdirSync(levelPath).length === 0) {
        fs.rmdirSync(levelPath)
      }
    }
  });
};

// exports.sortingFiles = function(sourcePath, distPath, isDelete ) {
//   parseDir(path.normalize(sourcePath), path.normalize(distPath), isDelete);
// };

parseDir(path.normalize(sourcePath), path.normalize(distPath), isDeleteSource);
// let fileContent = fs.readFile("./HelloWorld.txt", "utf-8", function (err, data) {
//   try {
//     console.log(typeof data);
//   } catch (err) {
//     console.warn(err);
//   }
// });


// console.log(path.extname(__filename + path.join('ff', 'HelloWorld.txt')));