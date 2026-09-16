import { pool } from "../config/db.js";
import { type Request, type Response } from 'express';

export async function getAllTasks(req: Request , res: Response) {
    try {
        const [tasks] = await pool.query(`
            SELECT * 
            FROM task;
        `);
    
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Database Error'})
    }
}

export async function getTaskById(req: Request<{taskId: string}> , res: Response) {
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