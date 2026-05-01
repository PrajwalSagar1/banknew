console.log('--- Test Start ---');
const axios = require('axios');
async function test() {
    try {
        console.log('Fetching health check...');
        const r = await axios.get('http://localhost:5000/');
        console.log('Health check response:', r.data);
    } catch (e) {
        console.log(JSON.stringify(e.response?.data || e.message, null, 2));
    }
}
test();
