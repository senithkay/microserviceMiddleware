import mysql from 'mysql2';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

const pool =  mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password:  process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE
}).promise()


export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user");
    return rows;
}

export async function getUserID(id) {
    console.log(id);

    const encoder = new TextEncoder();
    const userIDBuffer = encoder.encode(id);

    console.log(userIDBuffer);

    const [row] = await pool.query(`
        SELECT * 
        FROM user
        WHERE userId = ?
    `, [userIDBuffer]);

    console.log(row);
    return row;
}

export async function getAllUserBills(id) {
    const userIDBuffer = Buffer.from(id, 'hex');
    const [rows] = await pool.query(`
    SELECT 
        bc.billId,
        bc.status,
        b.amount
    FROM
        billcustomer bc
    JOIN 
        bill b ON bc.billId = b.billId
    WHERE bc.userId = ?
    `, [userIDBuffer]);

    return rows;
}

export async function getUserBillsNotPaid(id) {
    const userIDBuffer = Buffer.from(id, 'hex');
    const [rows] = await pool.query(`
        SELECT 
            bc.billId,
            bc.status,
            b.amount,
            sb.serviceId,
            ts.serviceName,
            ts.monthlyCharge
        FROM 
            billcustomer bc
        JOIN 
            bill b ON bc.billId = b.billId
        JOIN 
            servicebill sb ON bc.billId = sb.billId
        JOIN 
            telcoservices ts ON sb.serviceId = ts.serviceId
        WHERE 
            bc.userId = ? AND
            bc.status = 0
    `, [userIDBuffer]);

    const groupedResults = {};
    
    rows.forEach(row => {
        const { billId, status, amount, serviceId, serviceName, monthlyCharge } = row;
        if (!groupedResults[billId]) {
            groupedResults[billId] = {
                billId,
                status,
                amount,
                services: []
            };
        }
        groupedResults[billId].services.push({
            serviceId,
            serviceName,
            monthlyCharge
        });
    });

    const formattedResults = Object.values(groupedResults);

    return formattedResults;
}

export async function getUserBillsPaid(id) {
    const userIDBuffer = Buffer.from(id, 'hex');
    const [rows] = await pool.query(`
        SELECT 
            bc.billId,
            bc.status,
            b.amount,
            sb.serviceId,
            ts.serviceName,
            ts.monthlyCharge
        FROM 
            billcustomer bc
        JOIN 
            bill b ON bc.billId = b.billId
        JOIN 
            servicebill sb ON bc.billId = sb.billId
        JOIN 
            telcoservices ts ON sb.serviceId = ts.serviceId
        WHERE 
            bc.userId = ? AND
            bc.status = 1
    `, [userIDBuffer]);

    const groupedResults = {};
    
    rows.forEach(row => {
        const { billId, status, amount, serviceId, serviceName, monthlyCharge } = row;
        if (!groupedResults[billId]) {
            groupedResults[billId] = {
                billId,
                status,
                amount,
                services: []
            };
        }
        groupedResults[billId].services.push({
            serviceId,
            serviceName,
            monthlyCharge
        });
    });

    const formattedResults = Object.values(groupedResults);

    return formattedResults;
}

// const rows = await getUsers();
// console.log(rows);

// const user1ID = "75736572330000000000000000000000"
// const rowId = await getUserID(user1ID);
// console.log(rowId);