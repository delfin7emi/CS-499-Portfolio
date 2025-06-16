// ============================================
// Dog Validation Middleware
// Ensures all required fields are present and valid
// Used in POST /dogs route
// ============================================

module.exports = function validateDog(req, res, next) {
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
    inServiceCountry
  } = req.body;

  // -------------------- Helper: Check non-empty string --------------------
  const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

  // -------------------- Validate Required Strings --------------------
  const requiredStrings = {
    id,
    name,
    breed,
    gender,
    acquisitionDate,
    acquisitionLocation,
    trainingStatus,
    inServiceCountry
  };

  for (const [key, val] of Object.entries(requiredStrings)) {
    if (!isNonEmptyString(val)) {
      return res.status(400).json({ error: `Missing or invalid field: ${key}` });
    }
  }

  // -------------------- Validate Gender --------------------
  const allowedGenders = ["Male", "Female"];
  if (!allowedGenders.includes(gender)) {
    return res.status(400).json({ error: "Invalid gender. Must be 'Male' or 'Female'." });
  }

  // -------------------- Validate Training Status --------------------
  const allowedStatuses = ["Available", "In Service", "In Training"];
  if (!allowedStatuses.includes(trainingStatus)) {
    return res.status(400).json({ error: "Invalid trainingStatus. Must be one of: 'Available', 'In Service', 'In Training'." });
  }

  // -------------------- Validate Numbers --------------------
  if (typeof age !== "number" || age < 0) {
    return res.status(400).json({ error: "Age must be a non-negative number." });
  }

  if (typeof weight !== "number" || weight < 0) {
    return res.status(400).json({ error: "Weight must be a non-negative number." });
  }

  // -------------------- Validate Boolean --------------------
  if (typeof reserved !== "boolean") {
    return res.status(400).json({ error: "Reserved must be a boolean (true or false)." });
  }

  // -------------------- All Valid --------------------
  next();
};
