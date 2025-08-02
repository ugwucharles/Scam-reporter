const ScamReport = require('./models/ScamReport');
const mongoose = require('mongoose');
require('dotenv').config();

async function debugBlacklistDetection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');
    
    const testPhone = '+1-555-SCAMMER';
    console.log(`\n🔍 Debugging blacklist detection for: ${testPhone}`);
    
    // Test 1: Direct phone search
    console.log('\n1. Testing direct phone match:');
    const directMatch = await ScamReport.countDocuments({
      'scammerInfo.phone': testPhone,
      status: { $in: ['approved', 'pending'] }
    });
    console.log(`   Direct match count: ${directMatch}`);
    
    // Test 2: Clean phone search  
    const cleanPhone = testPhone.replace(/[\s\-\(\)\+]/g, '');
    console.log(`\n2. Testing cleaned phone (${cleanPhone}):`);
    const cleanMatch = await ScamReport.countDocuments({
      'scammerInfo.phone': { 
        $regex: cleanPhone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
        $options: 'i' 
      },
      status: { $in: ['approved', 'pending'] }
    });
    console.log(`   Cleaned phone match count: ${cleanMatch}`);
    
    // Test 3: Get some actual phone numbers to see the format
    console.log('\n3. Sample phone numbers in database:');
    const sampleReports = await ScamReport.find({
      'scammerInfo.phone': { $exists: true, $ne: '' }
    }).limit(5).select('scammerInfo.phone');
    
    sampleReports.forEach((report, index) => {
      console.log(`   ${index + 1}. "${report.scammerInfo.phone}"`);
    });
    
    // Test 4: Pattern matching for phone detection
    const q = testPhone;
    const phonePattern = /[\+]?[\d\s\-\(\)]{7,}/;
    const isPhonePattern = phonePattern.test(q);
    console.log(`\n4. Phone pattern detection:`);
    console.log(`   Query: "${q}"`);
    console.log(`   Matches phone pattern: ${isPhonePattern}`);
    
    if (isPhonePattern) {
      const cleanQ = q.replace(/[\s\-\(\)\+]/g, '');
      console.log(`   Cleaned query: "${cleanQ}"`);
      console.log(`   Length: ${cleanQ.length}`);
      
      if (cleanQ.length >= 7) {
        const generalPhoneReports = await ScamReport.countDocuments({
          'scammerInfo.phone': { 
            $regex: cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
            $options: 'i' 
          },
          status: { $in: ['approved', 'pending'] }
        });
        console.log(`   General phone pattern match count: ${generalPhoneReports}`);
      }
    }
    
    // Test 5: Let's try a more flexible search
    console.log('\n5. Testing flexible search:');
    const flexibleMatch = await ScamReport.countDocuments({
      'scammerInfo.phone': { $regex: '555.*SCAMMER', $options: 'i' },
      status: { $in: ['approved', 'pending'] }
    });
    console.log(`   Flexible pattern match count: ${flexibleMatch}`);
    
    console.log('\n✅ Debug complete');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    process.exit(1);
  }
}

debugBlacklistDetection();
