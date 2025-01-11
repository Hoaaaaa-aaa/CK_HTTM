const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { getAdvice } = require('../controllers/chat');
const { getTransactions, getGuestToken } = require('../controllers/transaction');

const router = require('express').Router();


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .get('/get-transactions', getTransactions)
    .get('/get-advice', getAdvice)
    .get('/get-guest-token', getGuestToken)

module.exports = router