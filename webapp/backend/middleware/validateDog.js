// ============================================
// ✅ Dog Validation Middleware (Final Version)
// Ensures all fields match Dogs.js schema
// ============================================

module.exports = function validateDog(req, res, next) {
  const {
    id,
    name,
    breed,
    gender,
    age,
    weight,
    trainingStatus,
    reserved,
    inServiceCountry
  } = req.body;

  const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

  // ✅ Required string fields
  const requiredStrings = { id, name, breed, gender, trainingStatus, inServiceCountry };
  for (const [key, val] of Object.entries(requiredStrings)) {
    if (!isNonEmptyString(val)) {
      return res.status(400).json({ error: `Missing or invalid field: ${key}` });
    }
  }

  // ✅ Enum: gender
  const allowedGenders = ["male", "female"];
  if (!allowedGenders.includes(gender.toLowerCase())) {
    return res.status(400).json({ error: "Invalid gender. Must be 'male' or 'female'." });
  }

  // ✅ Enum: trainingStatus
  const allowedStatuses = ["intensive", "basic", "none"];
  if (!allowedStatuses.includes(trainingStatus.toLowerCase())) {
    return res.status(400).json({
      error: "Invalid trainingStatus. Must be 'intensive', 'basic', or 'none'."
    });
  }

  // ✅ Numeric: age and weight
  if (typeof age !== "number" || age < 0) {
    return res.status(400).json({ error: "Age must be a non-negative number." });
  }
  if (typeof weight !== "number" || weight < 0) {
    return res.status(400).json({ error: "Weight must be a non-negative number." });
  }

  // ✅ Boolean: reserved
  if (typeof reserved !== "boolean") {
    return res.status(400).json({ error: "Reserved must be a boolean (true or false)." });
  }

  next(); // ✅ All passed
};
