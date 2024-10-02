const nestedProp = (obj, path) => {
  return path.split('.').reduce((acc, key) => {
    if (!acc) return null;
    const match = key.match(/^([a-zA-Z_$][a-zA-Z_$0-9]*)\[(\d+)\]$/);
    if (match) {
      const arrayKey = match[1]; // The part before [0]
      const index = parseInt(match[2], 10); // The index number inside []
      return acc[arrayKey] && Array.isArray(acc[arrayKey]) ? acc[arrayKey][index] : null;
    }
    if (key.endsWith('[]')) {
      const arrayKey = key.slice(0, -2);
      return acc[arrayKey] && Array.isArray(acc[arrayKey]) ? acc[arrayKey].map(item => item.node) : [];
    }
    return acc[key] !== undefined ? acc[key] : null;
  }, obj);
};

module.exports = nestedProp;
