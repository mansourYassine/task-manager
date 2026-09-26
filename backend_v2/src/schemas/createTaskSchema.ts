import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().max(100),
    description: z.string().trim().max(300).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    dueDate: z.iso.date().optional(),
    assignedTo: z.string().optional()
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;