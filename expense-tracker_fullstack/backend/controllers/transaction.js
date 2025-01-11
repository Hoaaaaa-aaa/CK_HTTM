const ExpenseModel = require('../models/ExpenseModel')
const IncomeModel = require('../models/IncomeModel')
const axios = require('axios');

exports.getTransactions = async (req, res) => {
    try {
        const expenses = await ExpenseModel.find()
        const incomes = await IncomeModel.find()

        const transactions = [...expenses, ...incomes]
        transactions.sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).json(transactions)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({message: 'Server Error: ' + error.message})
    }
}

exports.getGuestToken = async (req, res) => {
    const baseUrl = 'http://103.238.235.121:8088/api/v1/';
    try {
        const response = await axios.post(baseUrl + 'security/login', {
            username: 'admin',
            password: 'admin',
            provider: 'db',
            refresh: false
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const accessToken = response.data.access_token;

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }

        const response2 = await axios.post(baseUrl + 'security/guest_token', {
            user: {username: "guest_user", first_name: "Guest", last_name: "User"},
            resources: [{type: "dashboard", id: "19afb03c-a46e-4def-9954-42875193283d"}],
            rls: []
        }, {
            headers: headers
        });

        const guestToken = response2.data.token;
        res.status(200).json(guestToken);
    } catch (error) {
        res.status(500).json({message: 'Server Error: ' + error.message});
    }
}
