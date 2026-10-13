import z, { email } from "zod";

export const registerUserSchema = z.object({
    name: z.string().trim().min(1, 'Name is require!').max(50),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().trim().min(8, 'Password should contains at least 8 characters!'),
    role: z.enum(['admin', 'employee'])
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;