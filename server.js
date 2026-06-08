<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ইসলামী ব্যাংক পিএলসি</title>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f1f5f9; margin: 0; padding: 15px; text-align: center; }
        .container { max-width: 450px; background: white; margin: 15px auto; padding: 20px; border-radius: 15px; box-shadow: 0px 4px 15px rgba(0,0,0,0.1); border-top: 6px solid #006837; }
        h2 { color: #006837; margin: 5px 0 15px 0; font-size: 24px; }
        input, select { width: 92%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; }
        button { width: 97%; padding: 12px; background-color: #006837; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold; margin-top: 10px; }
        button:hover { background-color: #00522b; }
        .tab-btn { width: 48%; display: inline-block; background-color: #e2e8f0; color: #333; margin-bottom: 15px; padding: 10px 0; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; }
        .tab-btn.active { background-color: #006837; color: white; }
        .profile-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #006837; display: block; margin: 10px auto; background: #eee; }
        .data-box { text-align: left; background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 10px; font-size: 14px; border: 1px solid #e2e8f0; }
        .statement-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; background: white; }
        .statement-table th, .statement-table td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        .statement-table th { background-color: #f1f5f9; color: #333; }
        .action-area { background: #f0fdf4; padding: 12px; border-radius: 8px; margin-top: 15px; text-align: left; border: 1px solid #bbf7d0; }
        .link-text { color: #006837; cursor: pointer; font-size: 13px; font-weight: bold; text-decoration: underline; display: inline-block; margin-top: 10px; }
    </style>
</head>
<body>

<div class="container" id="authContainer">
    <h2>🏛️ ইসলামী ব্যাংক পিএলসি</h2>
    <div id="tabDiv">
        <button class="tab-btn active" id="loginTab" onclick="switchAuth('login')">লগইন করুন</button>
        <button class="tab-btn" id="regTab" onclick="switchAuth('reg')">নতুন অ্যাকাউন্ট</button>
    </div>

    <div id="loginForm">
        <input type="text" id="loginAcc" placeholder="অ্যাকাউন্ট নম্বর">
        <input type="password" id="loginPin" placeholder="পিন বা পাসওয়ার্ড">
        <button onclick="loginUser()">ড্যাশবোর্ডে প্রবেশ করুন</button>
        <span class="link-text" onclick="switchAuth('forgot')">অ্যাকাউন্ট নম্বর ভুলে গেছেন?</span>
    </div>

    <div id="regForm" style="display: none;">
        <input type="text" id="name" placeholder="কাস্টমারের পুরো নাম">
        <input type="text" id="phone" placeholder="মোবাইল নম্বর">
        <input type="text" id="address" placeholder="বর্তমান ঠিকানা">
        <input type="number" id="deposit" placeholder="প্রাথমিক জমা (টাকা)">
        <input type="text" id="nominee" placeholder="নমিনির নাম">
        <input type="password" id="password" placeholder="পিন সেট করুন">
        <button onclick="createAccount()">অনলাইনে অ্যাকাউন্ট খুলুন</button>
    </div>

    <div class="action-area" style="background: #fff1f2; border: 1px solid #fda4af;">
        <h4 style="color: #9f1239; margin: 0;">🛡️ অ্যাডমিন এরিয়া</h4>
        <button onclick="showAllAccounts()" style="background-color: #9f1239;">সকল কাস্টমার দেখুন</button>
    </div>
</div>

<div class="container" id="adminContainer" style="display: none;">
    <h2>📊 কাস্টমার ডাটাবেজ</h2>
    <div id="adminList" class="data-box"></div>
    <button onclick="location.reload()" style="background-color: #555;">ফিরে যান</button>
</div>

<script>
    const BASE_URL = 'https://islamibankplc.onrender.com';

    function switchAuth(type) {
        document.getElementById('loginForm').style.display = (type === 'login') ? 'block' : 'none';
        document.getElementById('regForm').style.display = (type === 'reg') ? 'block' : 'none';
        document.getElementById('tabDiv').style.display = (type === 'forgot') ? 'none' : 'block';
    }

    async function showAllAccounts() {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/all-accounts`);
            const data = await res.json();
            let html = '<table border="1" width="100%"><tr><th>নাম</th><th>অ্যাকাউন্ট</th><th>ব্যালেন্স</th></tr>';
            for (let acc in data) {
                html += `<tr><td>${data[acc].name}</td><td>${acc}</td><td>${data[acc].balance}</td></tr>`;
            }
            html += '</table>';
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('adminContainer').style.display = 'block';
            document.getElementById('adminList').innerHTML = html;
        } catch(e) { alert('সার্ভার থেকে ডেটা আনতে সমস্যা হচ্ছে!'); }
    }
</script>
</body>
</html>
