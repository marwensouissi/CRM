const axios = require('axios');

const API_URL = 'http://localhost:8000/api';

async function verifyTickets() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginResponse = await axios.post(`${API_URL}/login`, {
            email: 'admin@flowcrm.com',
            password: 'password'
        });
        const token = loginResponse.data.token || loginResponse.data.access_token;
        if (!token) {
            console.error('Login failed. Response:', loginResponse.data);
            process.exit(1);
        }
        console.log('Login successful. Token:', token.substring(0, 10) + '...');

        // 2. Fetch Tickets
        console.log('Fetching tickets...');
        const ticketsResponse = await axios.get(`${API_URL}/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Success! Fetched ${ticketsResponse.data.length} tickets.`);
        console.log('Sample ticket:', ticketsResponse.data[0]);

    } catch (error) {
        console.error('Error verifying tickets:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

verifyTickets();
