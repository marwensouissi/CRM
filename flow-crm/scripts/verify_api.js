const axios = require('axios');

const API_URL = 'http://localhost:8000/api';
const LOGIN_URL = 'http://localhost:8000/api/login';

async function testApi() {
    try {
        console.log('--- Starting API Verification ---');

        // 1. Login
        console.log(`\n1. Attempting Login (admin@flowcrm.com)...`);
        // Note: Using 'password' as per DatabaseSeeder default
        const loginResponse = await axios.post(LOGIN_URL, {
            email: 'admin@flowcrm.com',
            password: 'password'
        }, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });

        const token = loginResponse.data.token || loginResponse.data.access_token;
        if (!token) {
            throw new Error('No token received from login response. Response: ' + JSON.stringify(loginResponse.data));
        }
        console.log('✅ Login Successful. Token received.');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        };

        // 2. Fetch User
        console.log(`\n2. Fetching Authenticated User...`);
        const userResponse = await axios.get('http://localhost:8000/api/user', config);
        console.log(`✅ User verified: ${userResponse.data.email} (${userResponse.data.role})`);

        // 3. Fetch Leads
        console.log(`\n3. Fetching Leads...`);
        const leadsResponse = await axios.get(`${API_URL}/leads`, config);
        // Returns paginated response or direct array
        const leads = leadsResponse.data.data || leadsResponse.data;
        console.log(`✅ Leads fetched. Count: ${Array.isArray(leads) ? leads.length : 'N/A'}`);

        if (Array.isArray(leads) && leads.length > 0) {
            const sample = leads[0];
            console.log(`   Sample Lead: ${sample.name} - Status: ${sample.status}`);
        } else if (leadsResponse.data.total) {
            console.log(`   Total Leads (Paginated): ${leadsResponse.data.total}`);
        }

        // 4. Fetch Stats
        console.log(`\n4. Fetching Dashboard Stats...`);
        const statsResponse = await axios.get(`${API_URL}/stats`, config);
        console.log(`✅ Stats fetched.`);

        const stats = statsResponse.data;
        // Simple display of stats keys/values
        if (typeof stats === 'object') {
            Object.keys(stats).slice(0, 5).forEach(key => {
                console.log(`   ${key}: ${JSON.stringify(stats[key])}`);
            });
        }

        console.log('\n--- Verification Complete: All Systems Go 🚀 ---');

    } catch (error) {
        console.error('\n❌ Verification Failed!');
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Is the backend server running on port 8000?');
        } else if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

testApi();
