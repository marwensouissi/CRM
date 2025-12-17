const axios = require('axios');

async function testLeadUpdate() {
    try {
        console.log('--- Testing Lead Status Update (PATCH) ---');

        // Login
        const loginResponse = await axios.post('http://localhost:8000/api/login', {
            email: 'admin@flowcrm.com',
            password: 'password'
        }, { headers: { 'Accept': 'application/json' } });

        const token = loginResponse.data.token || loginResponse.data.access_token;

        if (!token) {
            throw new Error('No token received from login response: ' + JSON.stringify(loginResponse.data));
        }

        const config = { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } };

        // Pick a lead (e.g., ID 1)
        const leadId = 1;

        // Pick a new status
        const status = 'PROPOSAL SENT';

        console.log(`Sending PATCH request to /leads/${leadId}/status with status: ${status}`);

        const response = await axios.patch(`http://localhost:8000/api/leads/${leadId}/status`, {
            status: status
        }, config);

        console.log('✅ Update Successful!');
        console.log(`Lead ID ${leadId} updated.`);
        console.log('Name:', response.data.name);
        console.log('Status:', response.data.status);

        if (response.data.status !== status) {
            console.warn(`WARNING: Expected status ${status} but got ${response.data.status}. Check if database updated.`);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) {
            console.log('Status Code:', error.response.status);
            console.log('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testLeadUpdate();
