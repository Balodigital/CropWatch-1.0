import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compresses and resizes an image to make it suitable for fast network upload.
 * Reduces dimensions to max 800px and sets quality to 0.6.
 */
export async function optimizeImageForUpload(uri: string): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // Resize to 800px width (maintaining aspect ratio)
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    
    return `data:image/jpeg;base64,${result.base64}`;
  } catch (error) {
    console.error('Image optimization failed:', error);
    throw error;
  }
}
