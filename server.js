const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

let accounts = {}; // মূল ডাটাবেজ

app.get('/', (req, res) => res.send('🏛️ Islami Bank PLC Ultimate Server is Live!'));

// নতুন অ্যাকাউন্ট খোলা
app.post('/api/create', (req, res) => {
    const { accNo, name, balance, password } = req.body;
    accounts[accNo] = { name, balance: parseInt(balance), password, messages: ['স্বাগতম! আপনার অ্যাকাউন্ট খোলা হয়েছে।'] };
    res.json({ message: 'সফল!' });
});

// লেনদেন ও মেসেজ সিস্টেম
app.post('/api/transaction', (req, res) => {
    const { accNo, amount, type } = req.body;
    if (accounts[accNo]) {
        accounts[accNo].balance += parseInt(amount);
        accounts[accNo].messages.push(`${type}: ${amount} টাকা। নতুন ব্যালেন্স: ${accounts[accNo].balance}`);
        res.json({ success: true, balance: accounts[accNo].balance });
    }
});

// অ্যাডমিন প্যানেল
app.get('/api/admin/all-accounts', (req, res) => res.json(accounts));

app.listen(3000, () => console.log('Server running...'));
