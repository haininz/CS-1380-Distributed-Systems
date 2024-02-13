let visited = new Set();
let duplicates = new Map();
let autoIncId = 0;

let nativeFunctionsToString = new Map();
let stringToNativeFunctions = new Map();

let nativeFunctionCheckList = [globalThis, console];

for (let i = 0; i < nativeFunctionCheckList.length; i++) {
  Object.getOwnPropertyNames(nativeFunctionCheckList[i]).forEach((prop) => {
    const value = nativeFunctionCheckList[i][prop];
    if (typeof value === 'function') {
      nativeFunctionsToString.set(value, prop);
      stringToNativeFunctions.set(prop, value);
    }
  });
}

function serialize(object) {
  // Base case for undefined
  if (object === undefined) {
    // return 'undefined';
    return JSON.stringify({data_type: 'Undefined', value: undefined});
  }

  // Handling Date objects
  if (object instanceof Date) {
    return JSON.stringify({data_type: 'Date', value: object.toISOString()});
  }

  // Handling Error objects
  if (object instanceof Error) {
    return JSON.stringify({data_type: 'Error', message: object.message,
      stack: object.stack});
  }

  // Handling functions
  if (typeof object === 'function') {
    if (nativeFunctionsToString.has(object)) {
      return JSON.stringify({data_type: 'Native',
        code: nativeFunctionsToString.get(object)});
    }
    return JSON.stringify({data_type: 'Function', code: object.toString()});
  }

  // Handling arrays and objects
  if (typeof object === 'object' && object !== null) {
    if (visited.has(object)) {
      duplicates.set(autoIncId, object);
      return JSON.stringify({data_type: 'Dup', value: autoIncId++}); ;
    }

    visited.add(object);

    const isObject = !Array.isArray(object);
    const processed = isObject ? {} : [];

    Object.entries(object).forEach(([key, value]) => {
      // Recursively serialize each property or element
      const serializedValue = serialize(value);
      if (isObject) { // Assign directly for objects
        processed[key] = serializedValue;
      } else { // Push directly for arrays
        processed.push(serializedValue);
      }
    });

    // The final structure is ready to be stringified as a whole
    return isObject ? `{${Object.entries(processed).
        map(([k, v]) => `"${k}":${v}`).join(',')}}` :
        `[${processed.join(',')}]`;
  }

  // Fallback for primitive types (number, string, boolean, null)
  return JSON.stringify(object);
}

function deserialize(string) {
  // Initial parse to convert the string into a JavaScript structure
  let parsedData = JSON.parse(string);

  // Function to recursively process the object
  function processObject(object) {
    if (Array.isArray(object)) {
      return object.map((item) => processObject(item));
    } else if (typeof object === 'object' && object !== null) {
      if (object.data_type === 'Function') {
        // Recreate the function from its code
        return new Function(`return (${object.code})`)();
      } else if (object.data_type === 'Date') {
        return new Date(object.value);
      } else if (object.data_type == 'Native') {
        return stringToNativeFunctions.get(object.code);
      } else if (object.data_type === 'Error') {
        const error = new Error(object.message);
        error.stack = object.stack;
        return error;
      } else if (object.data_type === 'Undefined') {
        return undefined;
      } else if (object.data_type === 'Dup') {
        return duplicates.get(object.value);
      } else {
        // Iterate through each property for nested objects
        for (const key of Object.keys(object)) {
          object[key] = processObject(object[key]);
        }
      }
    }
    return object;
  }

  // Apply the processing function to the parsed data
  parsedData = processObject(parsedData);

  return parsedData;
}


module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};

