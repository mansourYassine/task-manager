import type { RowDataPacket } from "mysql2";

export interface TaskRow extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    due_date: `${number}-${number}-${number}`;
    created_by: string;
    assigned_to: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate: `${number}-${number}-${number}`;
    createdBy: string;
    assignedTo: string;
}