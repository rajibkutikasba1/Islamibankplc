const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// সব কাস্টমার ডেটা রাখার মূল ডাটাবেজ অবজেক্ট
let accounts = {};

app.get('/', (req, res) => res.send('🏛️ Islami Bank PLC Ultimate Server is Live!'));

// ১. নতুন অ্যাকাউন্ট তৈরি করা
app.post('/api/bank/create-account', (req, res) => {
    const { name, phone, address, initialDeposit, nominee, customerImage, password } = req.body;
    
    if (!name || !phone || !address || !initialDeposit || !nominee || !password) {
        return res.status(400).json({ error: 'সব তথ্য সঠিকভাবে দিন!' });
    }
    
    // ৪ ডিজিটের একটি ইউনিক অ্যাকাউন্ট নম্বর তৈরি (যেমন: IB5421)
    const accountNumber = 'IB' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });
    
    accounts[accountNumber] = {
        name,
        phone,
        address,
        balance: Number(initialDeposit),
        nominee,
        customerImage: customerImage || 'https://www.w3schools.com/howto/img_avatar.png',
        password,
        statement: [{
            type: 'অ্যাকাউন্ট খোলা হয়েছে',
            amount: initialDeposit,
            date: now,
            details: `প্রাথমিক জমা সহ অ্যাকাউন্ট তৈরি সফল`
        }]
    };
    
    res.status(201).json({ accountNumber, name, message: 'অ্যাকাউন্ট তৈরি সফল!' });
});

// ২. লগইন করার API
app.post('/api/bank/login', (req, res) => {
    const { accountNumber, password } = req.body;
    const account = accounts[accountNumber];
    
    if (!account || account.password !== password) {
        return res.status(401).json({ error: 'অ্যাকাউন্ট নম্বর অথবা পিন ভুল!' });
    }
    
    res.json({ accountNumber, ...account });
});

// ৩. 🔑 অ্যাকাউন্ট নম্বর ভুলে গেলে তা পুনরুদ্ধার করার API
app.post('/api/bank/forgot-account', (req, res) => {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
        return res.status(400).json({ error: 'মোবাইল নম্বর এবং পিন দিন!' });
    }
    
    // মোবাইল নম্বর এবং পিন ম্যাচ করে অ্যাকাউন্ট নম্বর খুঁজে বের করা
    const foundAccountNumber = Object.keys(accounts).find(accNo => 
        accounts[accNo].phone === phone && accounts[accNo].password === password
    );
    
    if (!foundAccountNumber) {
        return res.status(404).json({ error: 'প্রদত্ত মোবাইল নম্বর এবং পিন দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি!' });
    }
    
    res.json({ accountNumber: foundAccountNumber, name: accounts[foundAccountNumber].name });
});

// ৪. টাকা জমা (Deposit) করার API
app.post('/api/bank/deposit', (req, res) => {
    const { accountNumber, amount } = req.body;
    const account = accounts[accountNumber];
    
    if (!account) return res.status(404).json({ error: 'অ্যাকাউন্ট পাওয়া যায়নি!' });
    if (Number(amount) <= 0) return res.status(400).json({ error: 'সঠীক পরিমাণ লিখুন!' });
    
    account.balance += Number(amount);
    const now = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });
    
    account.statement.push({
        type: 'নগদ জমা',
        amount: `+${amount}`,
        date: now,
        details: 'নিজস্ব অ্যাকাউন্ট থেকে ক্যাশ ইন'
    });
    
    res.json({ balance: account.balance, statement: account.statement });
});

// ৫. টাকা উত্তোলন (Withdraw) করার API
app.post('/api/bank/withdraw', (req, res) => {
    const { accountNumber, amount, password } = req.body;
    const account = accounts[accountNumber];
    
    if (!account || account.password !== password) return res.status(401).json({ error: 'পিন ভুল!' });
    if (Number(amount) > account.balance) return res.status(400).json({ error: 'পর্যাপ্ত ব্যালেন্স নেই!' });
    
    account.balance -= Number(amount);
    const now = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });
    
    account.statement.push({
        type: 'নগদ উত্তোলন',
        amount: `-${amount}`,
        date: now,
        details: 'এটিএম/ক্যাশ কাউন্টার থেকে উত্তোলন'
    });
    
    res.json({ balance: account.balance, statement: account.statement });
});

// ৬. ফান্ড ট্রান্সফার (Fund Transfer) করার API
app.post('/api/bank/transfer', (req, res) => {
    const { senderAcc, receiverAcc, amount, password } = req.body;
    const sender = accounts[senderAcc];
    const receiver = accounts[receiverAcc];
    
    if (!sender || sender.password !== password) return res.status(401).json({ error: 'আপনার পিন ভুল!' });
    if (!receiver) return res.status(404).json({ error: 'যাকে টাকা পাঠাবেন তার অ্যাকাউন্ট নম্বর পাওয়া যায়নি!' });
    if (Number(amount) > sender.balance) return res.status(400).json({ error: 'পর্যাপ্ত ব্যালেন্স নেই!' });
    
    sender.balance -= Number(amount);
    receiver.balance += Number(amount);
    
    const now = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });
    
    sender.statement.push({
        type: 'টাকা পাঠানো হয়েছে',
        amount: `-${amount}`,
        date: now,
        details: `প্রাপক অ্যাকাউন্ট: ${receiverAcc}`
    });
    
    receiver.statement.push({
        type: 'টাকা প্রাপ্তি',
        amount: `+${amount}`,
        date: now,
        details: `প্রেরক অ্যাকাউন্ট: ${senderAcc}`
    });
    
    res.json({ balance: sender.balance, statement: sender.statement });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running smoothly on port ${PORT}`));
// ৬. অ্যাডমিন প্যানেল: সব কাস্টমার দেখার জন্য
app.get('/api/admin/all-accounts', (req, res) => {
    res.json(accounts);
});

// ৭. অ্যাডমিন প্যানেল: কাস্টমার ডিলিট বা ব্লক করার জন্য
app.delete('/api/admin/delete-account/:accNo', (req, res) => {
    const accNo = req.params.accNo;
    if (accounts[accNo]) {
        delete accounts[accNo];
        res.json({ message: 'অ্যাকাউন্টটি ডিলিট করা হয়েছে!' });
    } else {
        res.status(404).json({ error: 'অ্যাকাউন্ট পাওয়া যায়নি!' });
    }
});
// সব অ্যাকাউন্টের ভেতর একটি নতুন 'messages' অ্যারে যোগ হবে
accounts[accountNumber] = {
    // ... আগের সব ডাটা ...
    messages: [{ date: new Date().toLocaleString(), text: 'আপনার ইসলামী ব্যাংক পিএলসি অ্যাকাউন্টে স্বাগতম!' }]
};

// কোনো লেনদেন হলেই কাস্টমারকে মেসেজ পাঠানো
function addMessage(accNo, text) {
    if(accounts[accNo]) {
        accounts[accNo].messages.push({ date: new Date().toLocaleString(), text });
    }
}

// Deposit ফাংশনে এই লাইনটি যোগ করুন: 
addMessage(accountNumber, `আপনার অ্যাকাউন্টে ${amount} টাকা জমা হয়েছে।`);

// Withdraw ফাংশনে এই লাইনটি যোগ করুন:
addMessage(accountNumber, `আপনার অ্যাকাউন্ট থেকে ${amount} টাকা উত্তোলন করা হয়েছে।`);
