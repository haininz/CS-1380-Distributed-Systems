const fs = require('fs');
const path = require('path');

// Specify the directory where files will be stored.
// const STORE_DIR = path.join(__dirname, 'store');
// if (!fs.existsSync(STORE_DIR)) {
//   fs.mkdirSync(STORE_DIR, {recursive: true});
// }
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function getStoreDir(gid = 'local') {
  return path.join(__dirname, 'store', gid);
}

const store = {};

store.get = function(key, callback) {
  let gid = 'local';
  if (typeof key === 'object' && key !== null) {
    gid = key.gid;
    key = key.key;
  }
  const STORE_DIR = getStoreDir(gid);


  if (key == null) {
    fs.readdir(STORE_DIR, (err, files) => {
      if (err) {
        callback(new Error('store.get failure: unable to list keys'), null);
      } else {
        callback(null, files);
      }
    });
  } else {
    const filePath = path.join(STORE_DIR, key);
    if (!fs.existsSync(filePath)) {
      callback(new Error('store.get failure: key does not exist'), null);
      return;
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(new Error('store.get failure: read error'), null);
      } else {
        try {
          const value = JSON.parse(data);
          callback(null, value);
        } catch (parseError) {
          callback(new Error('store.get failure: parse error'), null);
        }
      }
    });
  }
};

store.put = function(value, key, callback) {
  let gid = 'local';
  if (typeof key === 'object' && key !== null) {
    gid = key.gid;
    key = key.key;
  }

  const STORE_DIR = getStoreDir(gid);

  let serializedData;
  try {
    serializedData = JSON.stringify(value);
  } catch (serializationError) {
    callback(new Error('store.put failure: serialization error'), null);
    return;
  }

  if (key == null) {
    key = distribution.util.id.getID(value);
  }

  const filePath = path.join(STORE_DIR, key);
  ensureDirectoryExistence(filePath);
  fs.writeFile(filePath, serializedData, 'utf8', (err) => {
    if (err) {
      callback(new Error('store.put failure: write error'), null);
    } else {
      callback(null, value);
    }
  });
};

store.del = function(key, callback) {
  let gid = 'local';
  if (typeof key === 'object' && key !== null) {
    gid = key.gid;
    key = key.key;
  }

  const STORE_DIR = getStoreDir(gid);

  const filePath = path.join(STORE_DIR, key);
  if (!fs.existsSync(filePath)) {
    callback(new Error('store.del failure: key does not exist'), null);
    return;
  }

  fs.readFile(filePath, 'utf8', (readErr, data) => {
    if (readErr) {
      callback(new Error('store.del failure: read error before delete'), null);
    } else {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          callback(new Error('store.del failure: unlink error'), null);
        } else {
          try {
            const value = JSON.parse(data);
            callback(null, value);
          } catch (parseError) {
            callback(new Error('store.del failure: parse error'), null);
          }
        }
      });
    }
  });
};

store.reconf = function(groupCopy, checkPlacement) {
  checkPlacement(new Error('reconf error'), null);
};

module.exports = store;
