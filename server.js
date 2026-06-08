const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

let accounts = {};

app.get('/', (req, res) => res.send('🏛️ Islamibank Server is Live!'));

app.post('/api/bank/create-account', (req, res) => {
    const { name, initialDeposit, password } = req.body;
    if (!name || !initialDeposit || !password) {
        return res.status(400).json({ error: 'সব তথ্য দিন!' });
    }
    
    const accountNumber = 'IB' + Math.floor(1000 + Math.random() * 9000);
    accounts[accountNumber] = { 
        name, 
        balance: Number(initialDeposit), 
        password, 
        statement: [`প্রাথমিক জমা: ${initialDeposit} টাকা`] 
    };
    
    res.status(201).json({ accountNumber, name });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
