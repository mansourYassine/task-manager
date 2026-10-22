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