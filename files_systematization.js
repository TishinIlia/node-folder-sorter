const fs = require('fs');
const path = require('path');

const isDir = function (path) {
  return fs.statSync(path).isDirectory()
};

const isFile = function (path) {
  return fs.statSync(path).isFile()
};

const deleteEmptyDir = function(path) {
  if (fs.readdirSync(path).length === 0) {
    fs.rmdirSync(path);
  }
};

const recursiveDelete = function (folderPath) {
  const elements = fs.readdirSync(folderPath);
  elements.forEach(function (element) {
    const newPath = path.join(folderPath, element);
    if (isDir(newPath)) {
      recursiveDelete(newPath);
      deleteEmptyDir(folderPath)
    } else if (isFile(newPath)) {
      fs.unlinkSync(newPath);
      deleteEmptyDir(folderPath);
    }
  });
};

const createNewNameIfExist = function (sourcePath, distPath, element) {
  if (!fs.existsSync(path.join(distPath, element))) {
    fs.linkSync(sourcePath, path.join(distPath, element));
  } else {
    createNewNameIfExist(sourcePath, distPath, element + '_new');
  }
};

const parseDir = function (levelPath, distPath, isDelete) {
  const elements = fs.readdirSync(levelPath);

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath)
  }

  if (isDelete && elements.length === 0) {
    deleteEmptyDir(levelPath)
  }

  elements.forEach(function (element) {
    const newPath = path.join(levelPath, element);

    if (isDir(newPath)) {
      parseDir(newPath, distPath, isDelete);
      if (fs.readdirSync(levelPath).length === 0) {
        deleteEmptyDir(levelPath);
      }
      return
    }

    if (isFile(newPath)) {
      const firstChar = element[0].toUpperCase();
      const newDistPath = path.join(distPath, firstChar);

      if (!fs.existsSync(newDistPath)) {
        fs.mkdirSync(newDistPath)
      }

      // Not very good solution, just add 'new'
      createNewNameIfExist(newPath, newDistPath,element);


      if (isDelete) {
        fs.unlinkSync(newPath);
        deleteEmptyDir(levelPath)
      }
    }
  });
};

const filesSystematization = function (sourcePath, distPath, isDeleteSource) {
  sourcePath = path.join(sourcePath);
  distPath = path.join(distPath);
  // delete dist path, if it was created
  if (fs.existsSync(distPath)) {
    recursiveDelete(distPath)
  }
  parseDir(path.normalize(sourcePath), path.normalize(distPath), isDeleteSource);
};

exports.filesSystematization = filesSystematization;
