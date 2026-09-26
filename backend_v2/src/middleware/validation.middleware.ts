import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { CreateTask } from '../types/task.js';

export function validateTaskId(req: Request, res: Response, next: NextFunction) {
    if (Number.isInteger(Number(req.params.taskId))) {
        next();
    } else {
        res.status(400).json({success: false, message: "Invalid task id!"});
    }
}

export function validateTaskCreation(req: Request<{}, {}, CreateTask>, res: Response, next: NextFunction) {
    if (
        req.body === null ||
        typeof req.body !== "object" ||
        Array.isArray(req.body)
    ) {
        return res.status(400).json({
            success: false,
            errors: [{field: "body", message:"Request body must be a JSON object."}]
        })
    }
    
    const errors: { field: string, message: string } [] = [];
    const { title, description, priority, dueDate, assignedTo }: CreateTask = req.body;
    
    // Validate title
    if (typeof title !== "string") {
        errors.push({field: 'title', message: 'Title field is required!'});
    } else {
        if (title.trim().length === 0) {
            errors.push({field: 'title', message: 'Title field is required!'});
        } else if (title.trim().length > 100) {
            errors.push({field: 'title', message: 'Title must be equal or less than 100 characters!'});
        }

        req.body.title = title.trim();
    }

    // Validate description
    if (description != undefined) {
        if (typeof description !== "string") {
            errors.push({field: 'description', message: 'Description should be a string!'});
        }
    }

    // Validate priority
    const validPriority = ['LOW', 'MEDIUM', 'HIGH'];
    if (typeof priority!== 'string' || priority.trim().length === 0) {
        errors.push({field: 'priority', message: 'Priority field is required!'});
    } else if (!validPriority.includes(priority)) {
        errors.push({field: 'priority', message: 'Priority field must be LOW, MEDIUM or HIGH!'});
    }
    
    // Validate dueDate
    if (dueDate != undefined) {
        if (isNaN(Date.parse(dueDate)) || !/^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2})?/.test(dueDate)) {
            errors.push({field: 'dueDate', message: 'Due date must be a valid date!'});
        }
    }
    
    // Validate assignedTo : Temporarly check just if its string until adding Auth
    if (assignedTo != undefined) {
        if (typeof assignedTo !== "string") {
            errors.push({field: 'assignedTo', message: 'Assigned to field should be a string!'});
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({success: false, errors});
    }

    next();
}