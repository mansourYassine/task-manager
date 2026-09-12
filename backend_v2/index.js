import express from 'express';
import { pool } from './config/db.js';

const app = express();
const PORT = 3000;

app.get('/api/tasks', async (req, res) => {
    try {
        const [tasks] = await pool.query(`
            SELECT * 
            FROM task;
        `);
    
        console.log(tasks);
    
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Database Error'})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})