import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(5).max(300).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    dueDate: z.iso.date().optional(),
    assignedTo: z.string().trim().min(2).optional()
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;