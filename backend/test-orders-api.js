const axios = require('axios');

async function testOrdersAPI() {
  try {
    console.log('🧪 Testing Orders API...\n');
    
    // Test 1: Get all orders
    console.log('1. Testing GET /api/orders');
    const response = await axios.get('http://localhost:5000/api/orders');
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Orders found: ${response.data.length}`);
    
    if (response.data.length > 0) {
      const firstOrder = response.data[0];
      console.log(`✅ First order ID: ${firstOrder.id}`);
      console.log(`✅ Customer: ${firstOrder.name}`);
      console.log(`✅ Items: ${firstOrder.items?.length || 0}`);
      console.log(`✅ Total: ₹${firstOrder.total_amount}`);
      
      // Test 2: Get single order
      console.log(`\n2. Testing GET /api/orders/${firstOrder.id}`);
      const singleOrderResponse = await axios.get(`http://localhost:5000/api/orders/${firstOrder.id}`);
      console.log(`✅ Status: ${singleOrderResponse.status}`);
      console.log(`✅ Order details retrieved successfully`);
      
      // Test 3: Update order status
      console.log(`\n3. Testing PUT /api/orders/${firstOrder.id}/status`);
      const updateResponse = await axios.put(`http://localhost:5000/api/orders/${firstOrder.id}/status`, {
        status: 'Pending',
        payment_status: 'Pending'
      });
      console.log(`✅ Status: ${updateResponse.status}`);
      console.log(`✅ Order status updated successfully`);
    }
    
    console.log('\n🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

testOrdersAPI();
