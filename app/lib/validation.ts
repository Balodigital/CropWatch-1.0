// Validation Constants and Table Contexts Mapped from TABLE.md

export const VALID_CROPS = [
  'tomato', 'cassava', 'maize', 'pepper', 'rice', 'yam', 'cowpea', 'cocoa'
];

export const TABLE_CONTEXTS: Record<string, string> = {
  'tomato': "Top common diseases for Tomato in Nigeria include Early Blight (Alternaria solani: brown spots with concentric rings), Septoria Leaf Spot (small dark spots with lighter centers), and Fusarium Wilt (yellowing and wilting starting from lower leaves). Local treatments include neem oil spray and wood ash.",
  
  'cassava': "Top common diseases for Cassava in Nigeria include Cassava Mosaic Disease (CMD: twisted and mottled leaves), Cassava Brown Streak Disease (brown lesions on stems, necrosis in roots), and Bacterial Blight (water-soaked angular leaf spots). Priorities should include rogueing infected plants.",
  
  'maize': "Top common diseases for Maize in Nigeria include Maize Streak Virus (white to yellowish streaking on leaves), Northern Leaf Blight (large cigar-shaped lesions), and Fall Armyworm damage (often mistaken for disease). Prioritize early monitoring and local botanical insecticides if worms are present.",
  
  'pepper': "Top common diseases for Pepper in Nigeria include Anthracnose (sunken dark lesions on fruit), Bacterial Leaf Spot (small brown spots on leaves, defoliation), and Pepper Mosaic Virus (mottled yellow and green leaves). Emphasize crop rotation and removing infected fruits.",
  
  'rice': "Top common diseases for Rice in Nigeria include Rice Blast (diamond-shaped lesions with grey centers), Bacterial Leaf Blight (yellowing to white streaks from leaf tips down), and Sheath Blight (greenish-grey oval lesions). Recommend water management and avoiding excessive nitrogen.",
  
  'yam': "Top common diseases for Yam in Nigeria include Yam Anthracnose (blackening of vines and leaf spots), Yam Mosaic Virus (chlorotic mottling), and Dry Rot (mostly post-harvest but starts in field). Advise using healthy seed yams.",
  
  'cowpea': "Top common diseases for Cowpea in Nigeria include Cercospora Leaf Spot (red-brown circular spots), Rust (small reddish-brown pustules), and Cowpea Mosaic Virus. Emphasize early planting and field sanitation.",
  
  'cocoa': "Top common diseases for Cocoa in Nigeria include Black Pod Disease (brown/black rotting pods starting from stalk), Cocoa Swollen Shoot Virus (swelling of stems/roots), and Witches' Broom. Black Pod is extremely common; recommend frequent harvesting and copper-based sprays if local remedies fail."
};

/**
 * Validates payload constraints
 */
export function validateScanInput(image: string, crop: string, description: string) {
  const errors = [];
  
  if (!image || !image.startsWith("data:image/")) {
    errors.push("Invalid image format or missing image.");
  }
  
  // Basic byte size calculation from base64 (Approx 5MB limit)
  if (image) {
    const stringLength = image.length - 'data:image/png;base64,'.length;
    const sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
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
