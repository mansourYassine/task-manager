import type { RowDataPacket } from "mysql2";

export interface TaskRow extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    due_date: string;
    created_by: string;
    assigned_to: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate: string;
    createdBy: string;
    assignedTo: string;
}

export interface CreateTask {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: string;
    assignedTo: string;
}

export interface UpdatedTask {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate: string;
    assignedTo: string;
}