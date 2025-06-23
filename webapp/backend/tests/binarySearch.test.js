// Import the binarySearch function from your utils directory
const binarySearch = require("../utils/binarySearch");

describe("binarySearch()", () => {
  // Sample animal data (must be sorted by 'id' for binary search to work correctly)
  const sampleAnimals = [
    { id: "A001", name: "Buddy" },
    { id: "A002", name: "Charlie" },
    { id: "A003", name: "Max" },
    { id: "A004", name: "Rocky" },
    { id: "A005", name: "Bella" },
  ];

  test("returns correct object when ID is in the middle", () => {
    const result = binarySearch(sampleAnimals, "A003");
    expect(result).toEqual({ id: "A003", name: "Max" });
  });

  test("returns correct object when ID is the first element", () => {
    const result = binarySearch(sampleAnimals, "A001");
    expect(result).toEqual({ id: "A001", name: "Buddy" });
  });

  test("returns correct object when ID is the last element", () => {
    const result = binarySearch(sampleAnimals, "A005");
    expect(result).toEqual({ id: "A005", name: "Bella" });
  });

  test("returns null when ID does not exist", () => {
    const result = binarySearch(sampleAnimals, "Z999");
    expect(result).toBeNull();
  });

  test("returns null when input array is empty", () => {
    const result = binarySearch([], "A001");
    expect(result).toBeNull();
  });

  test("works with numeric-looking string IDs", () => {
    const numericData = [
      { id: "100" },
      { id: "200" },
      { id: "300" }
    ];
    const result = binarySearch(numericData, "200");
    expect(result).toEqual({ id: "200" });
  });

  test("is case-insensitive with mixed casing", () => {
    const result = binarySearch(sampleAnimals, "a003");
    expect(result).toEqual({ id: "A003", name: "Max" });
  });

  test("returns null for non-string targetId", () => {
    const result = binarySearch(sampleAnimals, 300); // invalid type
    expect(result).toBeNull();
  });

  test("skips invalid entries safely", () => {
    const corruptedData = [
      { id: "A001" },
      null,
      { id: null },
      { id: "A002" }
    ];
    const sorted = corruptedData.filter(e => e?.id).sort((a, b) => a.id.localeCompare(b.id));
    const result = binarySearch(sorted, "A002");
    expect(result).toEqual({ id: "A002" });
  });
});
