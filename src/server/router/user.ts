import { createRouter } from './context';
import { z } from 'zod';

export const userRouter = createRouter().query('getAll', {
    async resolve({ ctx }) {
        const userId = ctx.session?.user?.id;
        if (!userId) return;
        return await ctx.prisma.user.findMany();
    },
});
