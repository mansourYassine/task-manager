import type { Task, TaskRow } from "../../types/user.js";

export function mapTaskRowToTask (t: TaskRow): Task {
    return {
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: t.due_date,
        createdBy: t.created_by,
        assignedTo: t.assigned_to
    }
}