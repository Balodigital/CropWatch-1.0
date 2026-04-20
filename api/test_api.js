require('dotenv').config();
const { runDeepSeekAnalysis } = require('./services/deepseek');

async function testDiagnosis() {
  console.log('🧪 Testing DeepSeek Diagnosis Pipeline...');
  
  const mockInput = {
    image_base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...', // Mock base64
    description: 'Yellow spots on the edges of the leaves and wilting at the bottom.',
    crop_type: 'tomato'
  };

  try {
    const result = await runDeepSeekAnalysis(
      mockInput.image_base64,
      mockInput.description,
      mockInput.crop_type
    );

    console.log('\n✅ Diagnosis Result:');
    console.log(JSON.stringify(result, null, 2));
    
    const isFallback = result.diagnosis[0]?.name === "Early Blight (Alternaria solani)";
    
    if (isFallback) {
      console.log('\n⚠️  Note: The system used the FALLBACK logic because the AI connection failed (timeout or error).');
    } else if (result.diagnosis && result.diagnosis.length > 0) {
      console.log('\n✨ API is working correctly with LIVE DeepSeek data!');
    } else {
      console.log('\n⚠️ API returned an empty result.');
    }
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
  }
}

testDiagnosis();
