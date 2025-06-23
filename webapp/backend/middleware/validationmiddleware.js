// ============================================
// Middleware: validationMiddleware.js
// Validates input for Dog and Monkey data
// ============================================

/**
 * Checks if the input is a non-empty string
 */
const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== "";

/**
 * Validates dog object fields in request body
 */
const validateDog = (req, res, next) => {
  const {
    id,
    name,
    breed,
    gender,
    age,
    weight,
    acquisitionDate,
    acquisitionLocation,
    trainingStatus,
    reserved,
    inServiceCountry,
  } = req.body;

  // Validate required non-empty strings
  if (
    !isNonEmptyString(id) ||
    !isNonEmptyString(name) ||
    !isNonEmptyString(breed) ||
    !isNonEmptyString(gender) ||
    !isNonEmptyString(acquisitionDate) ||
    !isNonEmptyString(acquisitionLocation) ||
    !isNonEmptyString(trainingStatus) ||
    !isNonEmptyString(inServiceCountry)
  ) {
    return res.status(400).json({ error: "All required dog fields must be valid non-empty strings." });
  }

  // Validate gender
  if (!["Male", "Female"].includes(gender)) {
    return res.status(400).json({ error: "Invalid gender. Must be 'Male' or 'Female'." });
  }

  // Validate training status
  const validStatuses = ["Available", "In Service", "In Training"];
  if (!validStatuses.includes(trainingStatus)) {
    return res.status(400).json({ error: "Invalid training status for dog." });
  }

  // Validate age and weight
  if (typeof age !== "number" || age < 0) {
    return res.status(400).json({ error: "Age must be a non-negative number." });
  }

  if (typeof weight !== "number" || weight < 0) {
    return res.status(400).json({ error: "Weight must be a non-negative number." });
  }

  // Validate reserved
  if (typeof reserved !== "boolean") {
    return res.status(400).json({ error: "Reserved must be a boolean." });
  }

  next(); // Passed validation
};

/**
 * Validates monkey object fields in request body
 */
const validateMonkey = (req, res, next) => {
  const {
    id,
    name,
    species,
    tailLength,
    height,
    bodyLength,
    gender,
    age,
    weight,
    acquisitionDate,
    acquisitionLocation,
    trainingStatus,
    reserved,
    inServiceCountry,
  } = req.body;

  // Validate required string fields
  if (
    !isNonEmptyString(id) ||
    !isNonEmptyString(name) ||
    !isNonEmptyString(species) ||
    !isNonEmptyString(gender) ||
    !isNonEmptyString(acquisitionDate) ||
    !isNonEmptyString(acquisitionLocation) ||
    !isNonEmptyString(trainingStatus) ||
    !isNonEmptyString(inServiceCountry)
  ) {
    return res.status(400).json({ error: "All required monkey fields must be valid non-empty strings." });
  }

  // Validate gender
  if (!["Male", "Female"].includes(gender)) {
    return res.status(400).json({ error: "Invalid gender. Must be 'Male' or 'Female'." });
  }

  // Validate training status
  const validStatuses = ["Available", "In Service", "In Training"];
  if (!validStatuses.includes(trainingStatus)) {
    return res.status(400).json({ error: "Invalid training status for monkey." });
  }

  // Validate numeric values
  if (typeof tailLength !== "number" || tailLength < 0) {
    return res.status(400).json({ error: "Tail length must be a non-negative number." });
  }

  if (typeof height !== "number" || height < 0) {
    return res.status(400).json({ error: "Height must be a non-negative number." });
  }

  if (typeof bodyLength !== "number" || bodyLength < 0) {
    return res.status(400).json({ error: "Body length must be a non-negative number." });
  }

  if (typeof age !== "number" || age < 0) {
    return res.status(400).json({ error: "Age must be a non-negative number." });
  }

  if (typeof weight !== "number" || weight < 0) {
    return res.status(400).json({ error: "Weight must be a non-negative number." });
  }

  // Validate reserved
  if (typeof reserved !== "boolean") {
    return res.status(400).json({ error: "Reserved must be a boolean." });
  }

  next(); // Passed validation
};

module.exports = {
  validateDog,
  validateMonkey,
};
