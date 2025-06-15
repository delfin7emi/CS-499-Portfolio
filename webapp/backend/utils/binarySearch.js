/**
 * Performs binary search on a sorted array of objects based on their 'id' field.
 * This search is case-insensitive and assumes the array is already sorted.
 *
 * @param {Array} arr - Array of objects (e.g., dogs or monkeys) sorted by 'id'
 * @param {string} targetId - ID to search for (e.g., "D001", "M999")
 * @returns {Object|null} - The matching object or null if not found
 */
function binarySearch(arr, targetId) {
  if (!Array.isArray(arr) || !targetId) return null;

  // Normalize the target ID for case-insensitive comparison
  const normalizedTarget = targetId.toLowerCase();
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const currentId = arr[mid].id?.toLowerCase();

    if (!currentId) {
      // Skip invalid entries with missing ID
      return null;
    }

    if (currentId === normalizedTarget) {
      return arr[mid];
    } else if (currentId < normalizedTarget) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null; // Not found
}

module.exports = binarySearch;
