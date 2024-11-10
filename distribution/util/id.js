const assert = require('assert');
var crypto = require('crypto');

// The ID is the SHA256 hash of the JSON representation of the object
function getID(obj) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

// The NID is the SHA256 hash of the JSON representation of the node
function getNID(node) {
  node = {ip: node.ip, port: node.port};
  return getID(node);
}

// The SID is the first 5 characters of the NID
function getSID(node) {
  return getNID(node).substring(0, 5);
}


function idToNum(id) {
  let n = parseInt(id, 16);
  assert(!isNaN(n), 'idToNum: id is not in KID form!');
  return n;
}

function naiveHash(kid, nids) {
  nids.sort();
  return nids[idToNum(kid) % nids.length];
}

function consistentHash(kid, nids) {
  const kidHash = idToNum(kid);
  const temp = [];
  nids.forEach((nid) => {
    temp.push([nid, idToNum(nid)]);
  });
  temp.sort((a, b) => a[1] - b[1]);

  for (let [id, hash] of temp) {
    if (hash > kidHash) {
      return id;
    }
    return temp[0][0];
  }
}

function rendezvousHash(kid, nids) {
  let curMax = -Infinity;
  let res = null;

  nids.forEach((nid, index) => {
    let temp = idToNum(getID(kid + nid));
    if (temp > curMax) {
      curMax = temp;
      res = nid;
    }
  });

  return res;
}

module.exports = {
  getNID: getNID,
  getSID: getSID,
  getID: getID,
  idToNum: idToNum,
  naiveHash: naiveHash,
  consistentHash: consistentHash,
  rendezvousHash: rendezvousHash,
};
