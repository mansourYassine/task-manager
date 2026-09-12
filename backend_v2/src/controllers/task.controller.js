import { pool } from "../config/db.js";

export async function getAllTasks(req, res) {
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
}

export async function getTaskById(req, res) {
    try {
        const [task] = await pool.execute(`
            SELECT *
            FROM task
            WHERE id = ?
        `, [req.params.taskId]);

        console.log(task);
        res.json(task);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Database Error!'})
    }
}