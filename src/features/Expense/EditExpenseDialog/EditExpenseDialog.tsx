import { Dialog, Listbox, Transition } from '@headlessui/react';
import { Expense, Income } from '@prisma/client';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { trpc } from '../../../utils/trpc';
import { DeleteExpense } from './DeleteExpense';

interface EditExpenseDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    expense: Expense;
}
interface EditExpenseInputs {
    title?: string;
    amount?: number;
    frequency?: string;
    dayOfMonth?: number;
    dayOfWeek?: number;
    // nextPaycheck?: Date;
}
export const EditExpenseDialog = ({
    isOpen,
    setIsOpen,
    expense,
}: EditExpenseDialogProps) => {
    const { id, title, amount, frequency, dayOfMonth, dayOfWeek } = expense;
    // const [nextCheckDate, setNextCheckDate] = useState<Date | null>(
    //     nextPaycheck
    // );
    const [freq, setFreq] = useState(frequency);
    const utils = trpc.useContext();
    const mutation = trpc.useMutation(['expense.edit'], {
        onSuccess: () => {
            utils.invalidateQueries(['expense.getAll']);
            setIsOpen(false);
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditExpenseInputs>();

    // const [selectedPayPeriod, setSelectedPayPeriod] = useState(payPeriods[0]);
    const onSubmit: SubmitHandler<EditExpenseInputs> = (data) => {
        const { dayOfMonth, dayOfWeek, amount, title } = data;
        if (freq === 'Monthly') {
            mutation.mutate({
                id,
                title,
                frequency: freq,
                dayOfMonth: Number(dayOfMonth),
                amount: Number(amount),
            });
        }
        if (freq === 'Weekly') {
            mutation.mutate({
                id,
                title,
                frequency: freq,
                dayOfWeek: Number(dayOfWeek),
                amount: Number(amount),
            });
        }
    };

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full space-y-6 max-w-md transform rounded-2xl bg-white dark:bg-slate-800 dark-text-slate-100 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-end">
                                    <DeleteExpense
                                        id={id}
                                        closeModal={closeModal}
                                    />
                                </div>
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-medium leading-6 dark:text-slate-100 text-gray-900"
                                >
                                    Edit Expense
                                </Dialog.Title>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="mt-2 flex flex-col space-y-4 dark:text-slate-100"
                                >
                                    <div className="flex flex-col">
                                        <label className="">Title</label>
                                        <input
                                            defaultValue={title}
                                            className="bg-slate-700 rounded-md px-4 py-2 shadow-md"
                                            {...register('title', {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="bg-slate-700 rounded-md px-4 py-2 shadow-md"
                                            {...register('amount', {
                                                min: 0,
                                                required: true,
                                                value: amount,
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label>Frequency</label>
                                        <Listbox
                                            value={freq}
                                            onChange={setFreq}
                                        >
                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white dark:bg-slate-700 py-2 px-4 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                {freq}
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                <Listbox.Option
                                                    key={'Weekly'}
                                                    value={'Weekly'}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                            active
                                                                ? 'bg-amber-900 text-amber-100'
                                                                : 'text-gray-900 dark:text-slate-100'
                                                        }`
                                                    }
                                                >
                                                    {'Weekly'}
                                                </Listbox.Option>
                                                <Listbox.Option
                                                    key={'Monthly'}
                                                    value={'Monthly'}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                            active
                                                                ? 'bg-amber-900 text-amber-100'
                                                                : 'text-gray-900 dark:text-slate-100'
                                                        }`
                                                    }
                                                >
                                                    {'Monthly'}
                                                </Listbox.Option>
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    {freq === 'Monthly' && (
                                        <div className="flex flex-col">
                                            <label>Day of Month</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="28"
                                                className="bg-slate-700 rounded-md px-4 py-2 shadow-md"
                                                {...register('dayOfMonth', {
                                                    min: 0,
                                                    required: false,
                                                    value: dayOfMonth || 0,
                                                })}
                                            />
                                        </div>
                                    )}
                                    {freq === 'Weekly' && (
                                        <div className="flex flex-col">
                                            <label>Day of Week</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="7"
                                                className="bg-slate-700 rounded-md px-4 py-2 shadow-md"
                                                {...register('dayOfWeek', {
                                                    min: 1,
                                                    max: 7,
                                                    required: false,
                                                    value: dayOfWeek || 0,
                                                })}
                                            />
                                        </div>
                                    )}

                                    <div className="mt-10 flex justify-between">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border-2 border-blue-400 px-4 py-2 text-blue-400 shadow-xl shadow-blue-400/10 hover:scale-105 duration-300"
                                        >
                                            Edit Expense
                                        </button>
                                        <button
                                            // type="submit"
                                            className="inline-flex justify-center rounded-md border-2 border-red-400 px-4 py-2 text-red-400 shadow-xl shadow-red-400/10 hover:scale-105 duration-300"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
