// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { protectedExampleRouter } from './protected-example-router';
import { incomeRouter } from './income';
import { expenseRouter } from './expense';
import { budgetRouter } from './budget';
import { userRouter } from './user';

export const appRouter = createRouter()
    .transformer(superjson)
    .merge('question.', protectedExampleRouter)
    .merge('income.', incomeRouter)
    .merge('expense.', expenseRouter)
    .merge('budget.', budgetRouter)
    .merge('user.', userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
