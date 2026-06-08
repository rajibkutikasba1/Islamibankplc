const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// জেলা, উপজেলা, থানা ও গ্রামের ডেটাবেজ (এখানে আপনি আরও ডেটা যোগ করতে পারবেন)
const bdData = {
    "Dhaka": {
        "Savar": {
            thana: "Savar Model Thana",
            postOffice: "Savar-1340",
            villages: ["Rajashon", "Bank Town", "Anandapur"]
        },
        "Dhamrai": {
            thana: "Dhamrai Thana",
            postOffice: "Dhamrai-1350",
            villages: ["Kushura", "Sankarpura", "Rowatpur"]
        }
    },
    "Chittagong": {
        "Hathazari": {
            thana: "Hathazari Thana",
            postOffice: "Hathazari-4330",
            villages: ["Fatehpur", "Chhipatali", "Mekhal"]
        }
    }
};

// ১. সার্ভার লাইভ আছে কিনা চেক করার রুট
app.get('/', (req, res) => {
    res.send('🗺️ BD Location Server is Live!');
});

// ২. সব জেলার নাম নেওয়ার API
app.get('/api/districts', (req, res) => {
    res.json(Object.keys(bdData));
});

// ৩. নির্দিষ্ট জেলার উপজেলা নেওয়ার API
app.get('/api/upazilas/:district', (req, res) => {
    const district = req.params.district;
    if (bdData[district]) {
        res.json(Object.keys(bdData[district]));
    } else {
        res.status(404).json({ error: "District not found" });
    }
});

// ৪. নির্দিষ্ট উপজেলার বিস্তারিত তথ্য (থানা, পোস্ট অফিস, গ্রাম) নেওয়ার API
app.get('/api/details/:district/:upazila', (req, res) => {
    const { district, upazila } = req.params;
    if (bdData[district] && bdData[district][upazila]) {
        res.json(bdData[district][upazila]);
    } else {
        res.status(404).json({ error: "Data not found" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
