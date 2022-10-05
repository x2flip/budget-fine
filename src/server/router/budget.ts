import { createRouter } from './context';
import { z } from 'zod';
import {
    add,
    addDays,
    format,
    getDate,
    getDay,
    isBefore,
    isSameDay,
} from 'date-fns';

export const budgetRouter = createRouter().query('getBudget', {
    input: z.object({ baseAmount: z.number(), cutoff: z.date() }),
    async resolve({ ctx, input }) {
        //initialize base Amount
        let baseAmount = input.baseAmount;
        //initialize net amount
        let net = baseAmount;
        //inintialize cutoff Date
        let cutoffDate = addDays(input.cutoff, 1);
        // create current Date
        let today = new Date();
        //initialize calendar with today as first day
        let calendar: Calendar[] = [];

        // Get an array of incomes
        let incomes = await ctx.prisma.income.findMany();

        // Get array of expenses
        let expenses = await ctx.prisma.expense.findMany();

        // Create a loop that adds days to the calendar until you've reaches the cutoff date
        for (
            let d = today;
            d <= new Date(cutoffDate);
            d.setDate(d.getDate() + 1)
        ) {
            // For each day, loop through the incomes array
            // For each income,
            for (let i = 0; i < incomes.length; i++) {
                const income = incomes[i];
                const nextPaycheck = income?.nextPaycheck;
                const amount = income?.amount;
                if (!nextPaycheck || !amount) break;
                // Check to see if the next Paycheck date is on the same date as d
                if (isSameDay(new Date(d), nextPaycheck)) {
                    // add the paycheck amount to the net qty
                    net += amount;
                    // then add 14 days to the cutoff Date
                    incomes[i]!.nextPaycheck = addDays(nextPaycheck, 14);
                }
                // Check to see if the next paycheck date is before date as d
                if (isBefore(nextPaycheck, new Date(d)))
                    // add 14 days to the cutoff Date
                    incomes[i]!.nextPaycheck = addDays(nextPaycheck, 14);
            }

            // Loop through the expenses array and add an expense if the day falls on an expense day of month
            for (let j = 0; j < expenses.length; j++) {
                const expense = expenses[j];
                if (!expense) break;
                const { frequency, amount, dayOfMonth, dayOfWeek } = expense;
                if (frequency === 'Daily') {
                    //reduce the net by the expense amount
                    net -= amount;
                }
                if (frequency === 'Weekly') {
                    //Check to make sure there is a dayOfWeek present
                    if (!dayOfWeek) break;
                    // Get the current day of the Week and add 1 for the difference between datefns and this app
                    const currentDayOfWeek = getDay(new Date(d)) + 1;
                    // If the current day of the week is the same as the dayOfWeek, reduce the net by the amount
                    if (dayOfWeek === currentDayOfWeek) net -= amount;
                }
                if (frequency === 'Monthly') {
                    // If there is no dayOfMonth in the expense, then break
                    if (!dayOfMonth) break;
                    // Get the current day of the month
                    const dayOfMonthForCurrentDate = getDate(new Date(d));
                    // const dayOfMonthForCurrentDate = new Date(d).getDate();
                    //If the current day is the same as the day of month for the expense
                    if (dayOfMonthForCurrentDate === dayOfMonth) {
                        // Reduce the net by the expense amount
                        net -= amount;
                    }
                }
            }

            // Push the new Date and net amount into the calendar
            calendar.push({ date: new Date(d), net });
        }

        //return the calendar
        return calendar;
    },
});

interface Calendar {
    date: Date;
    net: number;
}
