// Import the binarySearch function from your utils directory
const binarySearch = require("../utils/binarySearch");

describe("binarySearch", () => {
  // Sample animal data used in tests — MUST be sorted by `id`
  const sampleAnimals = [
    { id: "A001", name: "Buddy" },
    { id: "A002", name: "Charlie" },
    { id: "A003", name: "Max" },
    { id: "A004", name: "Rocky" },
    { id: "A005", name: "Bella" },
  ];

  //  Test middle element
  test("should return the correct object when ID exists in the middle", () => {
    const result = binarySearch(sampleAnimals, "A003");
    expect(result).toEqual({ id: "A003", name: "Max" });
  });

  //  Test first element
  test("should return the correct object when ID exists at the beginning", () => {
    const result = binarySearch(sampleAnimals, "A001");
    expect(result).toEqual({ id: "A001", name: "Buddy" });
  });

  //  Test last element
  test("should return the correct object when ID exists at the end", () => {
    const result = binarySearch(sampleAnimals, "A005");
    expect(result).toEqual({ id: "A005", name: "Bella" });
  });

  //  Test non-existent ID
  test("should return null when ID does not exist", () => {
    const result = binarySearch(sampleAnimals, "Z999");
    expect(result).toBeNull();
  });

  //  Test with empty array
  test("should return null for empty array", () => {
    const result = binarySearch([], "A001");
    expect(result).toBeNull();
  });

  //  Test numeric-looking string IDs
  test("should handle numeric-like string IDs", () => {
    const numericData = [
      { id: "100" },
      { id: "200" },
      { id: "300" }
    ];
    const result = binarySearch(numericData, "200");
    expect(result).toEqual({ id: "200" });
  });
});
