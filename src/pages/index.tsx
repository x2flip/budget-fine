import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { getSession, signIn, useSession } from 'next-auth/react';
import { UserAvatar } from '../components/UserAvatar';
import { GetBudgetModal } from '../features/GetBudget';
import { AddIncomeDialog } from '../features/Income';
import { IncomeCard } from '../features/Income/components/IncomeCard';
import { AddExpenseDialog } from '../features/Expense';
import { ExpenseCard } from '../features/Expense/ExpenseCard/ExpenseCard';
import { redirect } from 'next/dist/server/api-utils';
import { stat } from 'fs';

// export async function getServerSideProps(context: any) {
//     const session = await getSession();
//     if (!session) {
//         return {
//             redirect: {
//                 destination: '/auth/signin',
//                 permanent: false,
//             },
//         };
//     }
//     return {
//         props: { session },
//     };
// }

const Home: NextPage = () => {
    let { data: session, status } = useSession();
    const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const [isGetBudgetModalOpen, setIsGetBudgetModalOpen] = useState(false);
    const incomes = trpc.useQuery(['income.getAll']);
    const expenses = trpc.useQuery(['expense.getAll']);
    const users = trpc.useQuery(['user.getAll']);
    console.log(users);
    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn();
        }
    }, [status]);

    return (
        <>
            <Head>
                <title>Budget Fine</title>
                <meta name="description" content="Budget Fine" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <nav className="dark:bg-slate-900 flex justify-end absolute w-full py-2">
                {session?.user?.image && (
                    <UserAvatar image={session.user.image} />
                )}
            </nav>
            <main className="flex items-center justify-center min-h-screen dark:bg-slate-900 dark:text-slate-100">
                {/* {!session ? (
                    <button
                        className="px-4 py-2 rounded-md shadow-md border-2 border-purple-400 text-purple-200 font-semibold hover:scale-110 transition-all duration-300"
                        onClick={() => signIn()}
                    >
                        Login With Discord
                    </button>
                ) : ( */}
                <div className="flex flex-col my-20 space-y-10">
                    {/* {session?.user?.image && (
                            <UserAvatar image={session.user.image} />
                        )} */}
                    <button
                        onClick={() => setIsGetBudgetModalOpen(true)}
                        className="border-2 border-cyan-400 py-4 text-cyan-400 shadow-xl shadow-cyan-400/20 rounded-md"
                    >
                        Get Budget!
                    </button>
                    <GetBudgetModal
                        incomes={incomes?.data}
                        isOpen={isGetBudgetModalOpen}
                        setIsOpen={setIsGetBudgetModalOpen}
                    />
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10">
                        <div className="flex flex-col space-y-6 w-full">
                            <h2 className="text-3xl text-center font-bold">
                                Incomes
                            </h2>
                            <AddIncomeDialog
                                isOpen={isAddIncomeModalOpen}
                                setIsOpen={setIsAddIncomeModalOpen}
                            />
                            {incomes?.data &&
                                incomes.data.map((income) => (
                                    <IncomeCard
                                        key={income.id}
                                        income={income}
                                    />
                                ))}
                            <button
                                onClick={() => setIsAddIncomeModalOpen(true)}
                                className="py-2 px-4 border-2 border-green-500 text-green-500 shadow-xl shadow-green-500/20 rounded-md"
                            >
                                Add income
                            </button>
                        </div>
                        <div className="flex flex-col space-y-6 w-full">
                            <h2 className="text-3xl text-center font-bold">
                                Expenses
                            </h2>
                            <AddExpenseDialog
                                isOpen={isAddExpenseModalOpen}
                                setIsOpen={setIsAddExpenseModalOpen}
                            />
                            {expenses?.data &&
                                expenses.data.map((expense) => (
                                    <ExpenseCard
                                        key={expense.id}
                                        expense={expense}
                                    />
                                ))}
                            <button
                                onClick={() => setIsAddExpenseModalOpen(true)}
                                className="py-2 px-4 border-2 border-red-500 text-red-500 rounded-md shadow-xl shadow-red-400/20"
                            >
                                Add expense
                            </button>
                        </div>
                    </div>
                </div>
                {/* )} */}
            </main>
        </>
    );
};

export default Home;
