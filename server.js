const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// সব অ্যাকাউন্ট এবং ডেটা রাখার অবজেক্ট
let accounts = {};

// হোম রুট
app.get('/', (req, res) => res.send('🏛️ Islami Bank PLC Advanced Server is Live!'));

// ১. অ্যাকাউন্ট তৈরির API (নাম, মোবাইল, ঠিকানা, নমিনি, ছবি, পিন সহ)
app.post('/api/bank/create-account', (req, res) => {
    const { name, phone, address, initialDeposit, nominee, customerImage, password } = req.body;
    
    if (!name || !phone || !address || !initialDeposit || !nominee || !password) {
        return res.status(400).json({ error: 'সব তথ্য সঠিকভাবে দিন!' });
    }
    
    const accountNumber = 'IB' + Math.floor(1000 + Math.random() * 9000);
    
    accounts[accountNumber] = {
        name,
        phone,
        address,
        balance: Number(initialDeposit),
        nominee,
        customerImage: customerImage || 'https://www.w3schools.com/howto/img_avatar.png',
        password,
        statement: [`অ্যাকাউন্ট খোলা হয়েছে। প্রাথমিক জমা: ${initialDeposit} টাকা`]
    };
    
    res.status(201).json({ accountNumber, name, message: 'অ্যাকাউন্ট তৈরি সফল!' });
});

// ২. লগইন এবং কাস্টমার প্রোফাইল/স্টেটমেন্ট দেখার API
app.post('/api/bank/login', (req, res) => {
    const { accountNumber, password } = req.body;
    const account = accounts[accountNumber];
    
    if (!account || account.password !== password) {
        return res.status(401).json({ error: 'অ্যাকাউন্ট নম্বর অথবা পিন ভুল!' });
    }
    
    res.json({ accountNumber, ...account });
});

// ৩. টাকা জমা (Deposit) করার API
app.post('/api/bank/deposit', (req, res) => {
    const { accountNumber, amount } = req.body;
    const account = accounts[accountNumber];
    
    if (!account) return res.status(404).json({ error: 'অ্যাকাউন্ট পাওয়া যায়নি!' });
    if (Number(amount) <= 0) return res.status(400).json({ error: 'সঠিক পরিমাণ লিখুন!' });
    
    account.balance += Number(amount);
    account.statement.push(`জমা: +${amount} টাকা`);
    
    res.json({ balance: account.balance, statement: account.statement });
});

// ৪. টাকা উত্তোলন (Withdraw) করার API
app.post('/api/bank/withdraw', (req, res) => {
    const { accountNumber, amount, password } = req.body;
    const account = accounts[accountNumber];
    
    if (!account || account.password !== password) return res.status(401).json({ error: 'পিন ভুল বা অ্যাকাউন্ট নম্বর সঠিক নয়!' });
    if (Number(amount) > account.balance) return res.status(400).json({ error: 'অ্যাউন্ট ব্যালেন্স পর্যাপ্ত নয়!' });
    
    account.balance -= Number(amount);
    account.statement.push(`উত্তোলন: -${amount} টাকা`);
    
    res.json({ balance: account.balance, statement: account.statement });
});

// ৫. টাকা ট্রান্সফার (Fund Transfer) করার API
app.post('/api/bank/transfer', (req, res) => {
    const { senderAcc, receiverAcc, amount, password } = req.body;
    const sender = accounts[senderAcc];
    const receiver = accounts[receiverAcc];
    
    if (!sender || sender.password !== password) return res.status(401).json({ error: 'আপনার পিন বা অ্যাকাউন্ট নম্বর ভুল!' });
    if (!receiver) return res.status(404).json({ error: 'যাকে টাকা পাঠাবেন তার অ্যাকাউন্ট নম্বর পাওয়া যায়নি!' });
    if (Number(amount) > sender.balance) return res.status(400).json({ error: 'পর্যাপ্ত ব্যালেন্স নেই!' });
    
    sender.balance -= Number(amount);
    receiver.balance += Number(amount);
    
    sender.statement.push(`স্থানান্তর: -${amount} টাকা (${receiverAcc} নম্বরে)`);
    receiver.statement.push(`প্রাপ্তি: +${amount} টাকা (${senderAcc} নম্বর থেকে)`);
    
    res.json({ balance: sender.balance, statement: sender.statement });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
