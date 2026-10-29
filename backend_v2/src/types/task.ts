import type { RowDataPacket } from "mysql2";

export interface TaskRow extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    due_date: string;
    created_by: number;
    assigned_to: number;
    created_by_name: string;
    assigned_to_name: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate: string;
    createdBy: number;
    assignedTo: number;
    createdByName: string;
    assignedToName: string;
}

export interface CreateTask {
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    assignedTo?: number;
}

export interface UpdatedTask {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate: string;
    assignedTo?: number;
}