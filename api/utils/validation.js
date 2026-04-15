const VALID_CROPS = [
  'tomato', 'cassava', 'maize', 'pepper', 'rice', 'yam', 'cowpea', 'cocoa'
];

function validateScanInput(image, crop, description) {
  const errors = [];

  if (!image || !image.startsWith("data:image/")) {
    errors.push("Invalid image format or missing image.");
  }

  if (image) {
    const stringLength = image.length - 'data:image/png;base64,'.length;
    const sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
    if (sizeInBytes > 5 * 1024 * 1024) {
      errors.push("Image exceeds 5MB limit.");
    }
  }

  if (!crop || !VALID_CROPS.includes(crop.toLowerCase())) {
    errors.push("Invalid or missing crop type.");
  }

  let cleanDesc = description ? description.trim().replace(/(<([^>]+)>)/gi, "") : "";

  if (cleanDesc.length > 500) {
    errors.push("Description exceeds 500 characters.");
  }

  if (cleanDesc.length > 0 && cleanDesc.length < 5) {
    errors.push("Description must be at least 5 characters if provided.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanDesc
  };
}

module.exports = { validateScanInput, VALID_CROPS };
