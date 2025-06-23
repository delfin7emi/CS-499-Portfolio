/**
 * Performs binary search on a sorted array of objects based on their 'id' field.
 * This version is case-insensitive, safe for missing fields, and avoids crashes.
 *
 * @param {Array<Object>} arr - Array of objects sorted by 'id'
 * @param {string} targetId - ID to search for
 * @returns {Object|null} - The found object or null
 */
function binarySearch(arr, targetId) {
  if (!Array.isArray(arr) || typeof targetId !== 'string') {
    console.warn("Invalid input to binarySearch");
    return null;
  }

  const normalizedTarget = targetId.trim().toLowerCase();
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Ensure the object at mid has an 'id'
    if (!arr[mid] || typeof arr[mid].id !== 'string') {
      console.warn(`Skipping invalid entry at index ${mid}`);
      left++; // Skip and move on
      continue;
    }

    const currentId = arr[mid].id.trim().toLowerCase();

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
