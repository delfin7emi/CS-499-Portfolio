// ============================================
// Monkey Validation Middleware
// Ensures all required monkey fields are valid
// ============================================

module.exports = function validateMonkey(req, res, next) {
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
    inServiceCountry
  } = req.body;

  // Helper function to validate non-empty strings
  const isNonEmptyString = (val) => typeof val === "string" && val.trim() !== "";

  // ========== STRING FIELD VALIDATION ==========
  const requiredStrings = {
    id,
    name,
    species,
    gender,
    acquisitionDate,
    acquisitionLocation,
    trainingStatus,
    inServiceCountry
  };

  for (const [field, value] of Object.entries(requiredStrings)) {
    if (!isNonEmptyString(value)) {
      return res.status(400).json({ error: `Missing or invalid field: ${field}` });
    }
  }

  // ========== ENUM VALIDATION ==========
  const validGenders = ["Male", "Female"];
  if (!validGenders.includes(gender)) {
    return res.status(400).json({ error: "Invalid gender. Must be 'Male' or 'Female'." });
  }

  const validStatuses = ["Available", "In Service", "In Training"];
  if (!validStatuses.includes(trainingStatus)) {
    return res.status(400).json({ error: "Invalid trainingStatus. Must be one of: Available, In Service, In Training." });
  }

  // ========== NUMERIC FIELD VALIDATION ==========
  const numericFields = {
    tailLength,
    height,
    bodyLength,
    age,
    weight
  };

  for (const [field, value] of Object.entries(numericFields)) {
    if (typeof value !== "number" || value < 0) {
      return res.status(400).json({ error: `${field} must be a non-negative number.` });
    }
  }

  // ========== BOOLEAN VALIDATION ==========
  if (typeof reserved !== "boolean") {
    return res.status(400).json({ error: "Reserved must be a boolean value." });
  }

  // Passed all checks
  next();
};
