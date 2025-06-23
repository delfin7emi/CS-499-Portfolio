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

  // ✅ Helper functions
  const isNonEmptyString = (val) =>
    typeof val === "string" && val.trim().length > 0;

  const isNonNegativeNumber = (val) =>
    typeof val === "number" && val >= 0;

  // ✅ Normalize input for enum validation (to lowercase)
  const normalizedGender = gender?.toLowerCase();
  const normalizedTrainingStatus = trainingStatus?.toLowerCase();
  const normalizedSpecies = species?.toLowerCase();

  // ✅ Validate required string fields
  const requiredStrings = {
    id,
    name,
    species,
    gender,
    acquisitionLocation,
    trainingStatus,
    inServiceCountry
  };

  for (const [key, val] of Object.entries(requiredStrings)) {
    if (!isNonEmptyString(val)) {
      return res
        .status(400)
        .json({ error: `Missing or invalid string field: '${key}'` });
    }
  }

  // ✅ Validate enums
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
    return res
      .status(400)
      .json({ error: "Invalid gender. Must be 'male' or 'female'." });
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

  // ✅ Validate acquisitionDate
  if (
    !isNonEmptyString(acquisitionDate) ||
    isNaN(Date.parse(acquisitionDate))
  ) {
    return res
      .status(400)
      .json({ error: "'acquisitionDate' must be a valid date string." });
  }

  // ✅ Validate non-negative numeric fields
  const numericFields = {
    tailLength,
    height,
    bodyLength,
    age,
    weight
  };

  for (const [key, val] of Object.entries(numericFields)) {
    if (!isNonNegativeNumber(val)) {
      return res
        .status(400)
        .json({ error: `'${key}' must be a non-negative number.` });
    }
  }

  // ✅ Validate boolean field
  if (typeof reserved !== "boolean") {
    return res
      .status(400)
      .json({ error: "'reserved' must be a boolean value." });
  }

  // ✅ Overwrite req.body with normalized enums
  req.body.gender = normalizedGender;
  req.body.trainingStatus = normalizedTrainingStatus;
  req.body.species = normalizedSpecies;

  // ✅ All validations passed
  next();
};
