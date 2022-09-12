import { createRouter } from './context';
import { z } from 'zod';

export const incomeRouter = createRouter()
    .mutation('create', {
        input: z.object({
            title: z.string(),
            amount: z.number(),
            payPeriod: z.string(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.income.create({ data: input });
        },
    })
    .query('getAll', {
        async resolve({ ctx }) {
            return await ctx.prisma.income.findMany();
        },
    })
    .mutation('edit', {
        input: z.object({
            id: z.number(),
            title: z.string().optional(),
            amount: z.number().optional(),
            payPeriod: z.string().optional(),
            nextPaycheck: z.date().nullish(),
        }),
        async resolve({ ctx, input }) {
            const { id, ...rest } = input;
            return await ctx.prisma.income.update({
                where: { id },
                data: { ...rest },
            });
        },
    });
