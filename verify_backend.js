const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const client = axios.create({ baseURL: API_URL, withCredentials: true });

async function verify() {
    console.log('--- Starting Full-Stack Verification ---');

    try {
        // 1. Health Check
        console.log('Testing Health Check...');
        const health = await axios.get('http://localhost:5000/');
        console.log('✅ Health Check:', health.data.message);

        const emailA = `test_a_${Date.now()}@test.com`;
        const emailB = `test_b_${Date.now()}@test.com`;

        // 2. Register User A
        console.log('\n--- Test: Registration ---');
        const regA = await client.post('/auth/register', {
            name: 'User A',
            email: emailA,
            password: 'password123'
        });
        const userA = regA.data.data.user;
        const tokenA = regA.data.data.accessToken;
        console.log('✅ User A Registered:', userA.email, '| Account:', userA.accountNumber);

        // 3. Register User B
        const regB = await client.post('/auth/register', {
            name: 'User B',
            email: emailB,
            password: 'password123'
        });
        const userB = regB.data.data.user;
        console.log('✅ User B Registered:', userB.email, '| Account:', userB.accountNumber);

        client.defaults.headers.common['Authorization'] = `Bearer ${tokenA}`;

        // 4. Login Check
        console.log('\n--- Test: Login ---');
        await client.post('/auth/login', {
            email: emailA,
            password: 'password123'
        });
        console.log('✅ Login Successful for User A');

        // 5. Get Profile
        console.log('\n--- Test: Profile ---');
        const profile = await client.get('/user/me');
        console.log('✅ Profile Data:', profile.data.data.name, '| Balance:', profile.data.data.balance);

        // 6. Deposit
        console.log('\n--- Test: Deposit ---');
        const dep = await client.post('/transactions/deposit', {
            amount: 1000,
            description: 'Test Deposit'
        });
        console.log('✅ Deposit Successful. New Balance:', dep.data.data.user.balance);

        // 7. Withdraw
        console.log('\n--- Test: Withdraw ---');
        const withdr = await client.post('/transactions/withdraw', {
            amount: 200,
            description: 'Test Withdrawal'
        });
        console.log('✅ Withdrawal Successful. New Balance:', withdr.data.data.user.balance);

        // 8. Transfer
        console.log('\n--- Test: Transfer ---');
        const trans = await client.post('/transactions/transfer', {
            recipientAccountNumber: userB.accountNumber,
            amount: 300,
            description: 'Test Transfer to B'
        });
        console.log('✅ Transfer Successful. Sender Balance:', trans.data.data.sender.balance);

        // 9. Verify Transfer History
        console.log('\n--- Test: Transactions History ---');
        const txHistory = await client.get('/transactions');
        console.log('✅ Transactions Count:', txHistory.data.data.length);

        // 10. Error Case: Insufficient Balance
        console.log('\n--- Test: Error Handling (Insufficient Balance) ---');
        try {
            await client.post('/transactions/withdraw', {
                amount: 5000,
                description: 'Broke withdrawal'
            });
        } catch (e) {
            console.log('✅ Caught Expected Error:', e.response?.data?.message || e.message);
        }

        console.log('\n--- Verification Complete! ---');

    } catch (error) {
        if (error.response) {
            console.error('\n❌ Verification Failed (Response):', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('\n❌ Verification Failed (Message):', error.message);
        }
    }
}

verify();
