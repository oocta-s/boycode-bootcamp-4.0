module.exports = function generateId(collection) {
  if (!Array.isArray(collection)) {
    throw new TypeError('generateId expects an array');
  }

  const validIds = collection
    .map(item => Number(item && item.id))
    .filter(id => Number.isFinite(id) && id > 0);

  const maxId = validIds.length > 0 ? Math.max(...validIds) : 0;
  return maxId + 1;
};
