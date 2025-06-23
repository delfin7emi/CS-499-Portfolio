// ==============================================
// ✅ Monkey Validation Middleware (Final Version)
// Fully matches Monkeys.js Mongoose schema with lowercase enums
// ==============================================

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

  // =======================
  // ✅ Helper Functions
  // =======================
  const isNonEmptyString = (val) =>
    typeof val === "string" && val.trim().length > 0;

  const isNonNegativeNumber = (val) =>
    typeof val === "number" && val >= 0;

  // =======================
  // ✅ Required String Fields
  // =======================
  const requiredStrings = {
    id,
    name,
    species,
    gender,
    acquisitionLocation,
    trainingStatus,
    inServiceCountry,
  };

  for (const [field, value] of Object.entries(requiredStrings)) {
    if (!isNonEmptyString(value)) {
      return res.status(400).json({
        error: `Missing or invalid string field: '${field}'`
      });
    }
  }

  // =======================
  // ✅ Normalize Casing
  // =======================
  const normalizedGender = gender.toLowerCase();
  const normalizedTrainingStatus = trainingStatus.toLowerCase();
  const normalizedSpecies = species.toLowerCase();

  // =======================
  // ✅ Validate Enums (lowercase)
  // =======================
  const allowedGenders = ["male", "female"];
  const allowedTrainingStatuses = ["intensive", "basic", "none"];
  const allowedSpecies = [
    "capuchin",
    "guenon",
    "macaque",
    "marmoset",
    "squirrel monkey",
    "tamarin"
  ];

  if (!allowedGenders.includes(normalizedGender)) {
    return res.status(400).json({
      error: "Invalid gender. Must be 'male' or 'female'."
    });
  }

  if (!allowedTrainingStatuses.includes(normalizedTrainingStatus)) {
    return res.status(400).json({
      error: "Invalid trainingStatus. Must be 'intensive', 'basic', or 'none'."
    });
  }

  if (!allowedSpecies.includes(normalizedSpecies)) {
    return res.status(400).json({
      error: `Invalid species. Must be one of: ${allowedSpecies.join(", ")}`
    });
  }

  // =======================
  // ✅ Date Validation
  // =======================
  if (
    !isNonEmptyString(acquisitionDate) ||
    isNaN(Date.parse(acquisitionDate))
  ) {
    return res.status(400).json({
      error: "'acquisitionDate' must be a valid date string."
    });
  }

  // =======================
  // ✅ Numeric Fields Validation
  // =======================
  const numericFields = {
    tailLength,
    height,
    bodyLength,
    age,
    weight,
  };

  for (const [field, value] of Object.entries(numericFields)) {
    if (!isNonNegativeNumber(value)) {
      return res.status(400).json({
        error: `'${field}' must be a non-negative number.`
      });
    }
  }

  // =======================
  // ✅ Boolean Validation
  // =======================
  if (typeof reserved !== "boolean") {
    return res.status(400).json({
      error: "'reserved' must be a boolean value."
    });
  }

  // =======================
  // ✅ Rewrite request values to normalized if needed
  // (Optional: Helps ensure stored values match schema)
  // =======================
  req.body.gender = normalizedGender;
  req.body.trainingStatus = normalizedTrainingStatus;
  req.body.species = allowedSpecies.includes(normalizedSpecies)
    ? allowedSpecies.find(s => s === normalizedSpecies)
    : species;

  // =======================
  // ✅ Pass to next handler
  // =======================
  next();
};
