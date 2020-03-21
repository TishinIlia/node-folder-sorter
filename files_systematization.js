const fs = require('fs');
const path = require('path');
const async = require('async');

const isDir = function (path, callback) {
  fs.stat(path, function (err, stats) {
    if (err) {
      console.error(err);
      return;
    }
    callback(stats.isDirectory())
  })
};

const isFile = function (path, callback) {
  fs.stat(path, function (err, stats) {
    if (err) {
      console.error(err);
      return;
    }
    callback(stats.isFile())
  });
};

const deleteEmptyDir = function(path) {
  fs.readdir(path, function (err, files) {
    if (err) {
      console.error(err);
      return;
    }
    if (files.length === 0) {
      fs.rmdir(path, function (err) {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  });
};

const recursiveDelete = function (folderPath) {
  fs.readdir(folderPath, function (err, elements) {
    if (err) {
      console.error(err);
      return;
    }
    elements.forEach(function (element) {
      const newPath = path.join(folderPath, element);

      const fileTypeCallback = function (result) {
        if (result) {
          fs.unlink(newPath, function (err) {
            if (err) {
              console.error(err);
              return;
            }
          });
          deleteEmptyDir(folderPath);
        }
      };

      const dirTypeCallback = function (result) {
        if (result) {
          recursiveDelete(newPath);
          deleteEmptyDir(folderPath)
        } else {
          isFile(newPath, fileTypeCallback)
        }
      };
      isDir(newPath, dirTypeCallback);
    });
  });
};

const createNewNameIfExist = function (sourcePath, distPath, element) {
  if (!fs.existsSync(path.join(distPath, element))) {
    fs.link(sourcePath, path.join(distPath, element), function (err) {
      if (err) {
        console.error(err);
        return;
      }
    });
  } else {
    createNewNameIfExist(sourcePath, distPath, element + '_new');
  }
};

const parseDir = function (levelPath, distPath, isDelete) {
  fs.readdir(levelPath, function (err, elements) {
    if (err) {
      console.error(err);
      return;
    }
    if (!fs.existsSync(distPath)) {
      fs.mkdir(distPath, function (err) {
        if (err) {
          console.error(err);
          return;
        }
      })
    }

    if (isDelete && elements.length === 0) {
      deleteEmptyDir(levelPath)
    }

    elements.forEach(function (element) {
      const newPath = path.join(levelPath, element);

      const fileTypeCallback = function (result) {
        if (result) {
          const firstChar = element[0].toUpperCase();
          const newDistPath = path.join(distPath, firstChar);

          if (!fs.existsSync(newDistPath)) {
            fs.mkdir(newDistPath, function (err) {
              if (err) {
                console.error(err);
                return;
              }
              // Not very good solution, just join 'new'
              createNewNameIfExist(newPath, newDistPath,element);


              if (isDelete) {
                fs.unlink(newPath, function (err) {
                  if (err) {
                    console.error(err);
                    return;
                  }
                });
                deleteEmptyDir(levelPath)
              }
            })
          } else {
            // Not very good solution, just join 'new'
            createNewNameIfExist(newPath, newDistPath,element);


            if (isDelete) {
              fs.unlink(newPath, function (err) {
                if (err) {
                  console.error(err);
                  return;
                }
              });
              deleteEmptyDir(levelPath)
            }
          }


        }
      };

      const dirTypeCallback = function (result) {
        if (result) {
          parseDir(newPath, distPath, isDelete);
          fs.readdir(levelPath, function (err, files) {
            if (err) {
              console.error(err);
              return;
            }
            if (files.length === 0) {
              deleteEmptyDir(levelPath);
            }
          });
          return;
        } else {
          isFile(newPath, fileTypeCallback)
        }
      };

      isDir(newPath, dirTypeCallback)
    });
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
