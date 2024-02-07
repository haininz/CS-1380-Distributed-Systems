function serialize(object) {
  if (object === undefined) {
    return 'undefined';
  }

  if (object instanceof Date) {
    return JSON.stringify({data_type: 'Date', value: object});
  }

  if (object instanceof Error) {
    return JSON.stringify({data_type: 'Error', message: object.message, stack: object.stack});
  }

  return JSON.stringify(object);
}

function deserialize(string) {
  if (string === 'undefined') {
    return undefined;
  }
  const data = JSON.parse(string);

  if (data && data.data_type === 'Date') {
    return new Date(data.value);
  }

  if (data && data.data_type === 'Error') {
    const error = new Error(data.message);
    error.stack = data.stack;
    return error;
  }

  return data;
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};

