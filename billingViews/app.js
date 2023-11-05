import express from 'express'
import {getAllUserBills, getUserBillsPaid, getUserBillsNotPaid, getUserID, getUsers } from './database.js';

const app = express();
app.use(express.json());

// app.get("/users", async (req, res) => {
//     const rows = await getUsers();
//     res.send(rows)
// });

// app.get("/users/:id", async (req, res) => {
//     const id = req.params.id
//     const row = await getUserID(id);
//     res.send(row)
// });

app.get("/allBills/:id", async (req, res) => {
    const id = req.params.id
    const row = await getAllUserBills(id);
    res.send(row)
});

app.get("/currentBills/:id", async (req, res) => {
    const id = req.params.id
    const row = await getUserBillsNotPaid(id);
    res.send(row)
});

app.get("/pastBills/:id", async (req, res) => {
    const id = req.params.id
    const row = await getUserBillsPaid(id);
    res.send(row)
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal Server Error');
});

app.listen(5775, () => {
    console.log('Server is running on port 5775')
})