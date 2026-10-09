import z from "zod";

export const taskParamsSchema = z.object({
    taskId: z.string().regex(/^\d+$/, 'Id must be numeric')
});

export type TaskParamsSchema = z.infer<typeof taskParamsSchema>;

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required!").max(100),
    description: z.string().trim().max(300).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], "You must choose a priority!"),
    dueDate: z.iso.date().optional(),
    assignedTo: z.string().trim().min(2).optional()
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required!").max(100),
    description: z.string().trim().max(300).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], "You must choose a priority!"),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], "You must choose a status!"),
    dueDate: z.iso.date().optional(),
    assignedTo: z.string().trim().min(2).optional()
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

export const updateStatusSchema = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export type UpdateStatusSchema = z.infer<typeof updateStatusSchema>;
