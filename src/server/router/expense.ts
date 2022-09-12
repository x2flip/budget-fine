import { createRouter } from './context';
import { z } from 'zod';

export const expenseRouter = createRouter()
    .mutation('create', {
        input: z.object({
            title: z.string(),
            amount: z.number(),
            frequency: z.string(),
            dayOfMonth: z.number().optional(),
            dayOfWeek: z.number().optional(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.expense.create({ data: input });
        },
    })
    .query('getAll', {
        async resolve({ ctx }) {
            return await ctx.prisma.expense.findMany();
        },
    })
    .mutation('edit', {
        input: z.object({
            id: z.number(),
            title: z.string().optional(),
            amount: z.number().optional(),
            frequency: z.string().optional(),
            dayOfMonth: z.number().nullish(),
            dayOfWeek: z.number().nullish(),
        }),
        async resolve({ ctx, input }) {
            const { id, ...rest } = input;
            return await ctx.prisma.expense.update({
                where: { id },
                data: { ...rest },
            });
        },
    });
