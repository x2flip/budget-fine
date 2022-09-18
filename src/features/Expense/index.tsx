import { Dispatch, SetStateAction, useState, Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { trpc } from '../../utils/trpc';

interface DialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}
type AddExpenseInputs = {
    title: string;
    amount: number;
    dayOfMonth?: number;
    dayOfWeek?: number;
};
type Frequency = 'Monthly' | 'Weekly' | 'Daily';
interface ExpenseFrequencyInputs {
    type: Frequency;
    description: string;
}
const frequencies: ExpenseFrequencyInputs[] = [
    { type: 'Monthly', description: 'Once a month' },
    { type: 'Weekly', description: 'Once a week' },
    { type: 'Daily', description: 'Once a day' },
];
export function AddExpenseDialog({ isOpen, setIsOpen }: DialogProps) {
    const utils = trpc.useContext();
    const mutation = trpc.useMutation(['expense.create'], {
        onSuccess: () => {
            utils.invalidateQueries(['expense.getAll']);
            setIsOpen(false);
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddExpenseInputs>();

    const [selectedFrequency, setSelectedFrequency] = useState(frequencies[0]);
    const onSubmit: SubmitHandler<AddExpenseInputs> = (data) => {
        let newExpense = {
            title: data.title,
            amount: Number(data.amount),
            frequency: selectedFrequency?.type || 'Monthly',
            dayOfMonth: Number(data.dayOfMonth),
            dayOfWeek: Number(data.dayOfWeek) || undefined,
        };
        console.log(newExpense);
        mutation.mutate(newExpense);
    };

    function closeModal() {
        setIsOpen(false);
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

                <div className="fixed inset-0">
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
                            <Dialog.Panel className="w-full space-y-6 max-w-md dark:bg-slate-800 dark:text-slate-100 transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-medium leading-6 text-gray-900 dark:text-slate-100"
                                >
                                    Add Expense
                                </Dialog.Title>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="mt-2 flex flex-col space-y-4"
                                >
                                    <div className="flex flex-col">
                                        <label>Title</label>
                                        <input
                                            className="px-4 py-2 bg-slate-700 rounded-md shadow-md"
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
                                            className="px-4 py-2 bg-slate-700 rounded-md shadow-md"
                                            {...register('amount', {
                                                min: 0,
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Frequency</label>
                                        <Listbox
                                            value={selectedFrequency}
                                            onChange={setSelectedFrequency}
                                        >
                                            <Listbox.Button className="cursor-pointer rounded-lg bg-white dark:bg-slate-700 w-full py-2 px-4 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                {selectedFrequency?.type}
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute z-20 mt-1 overflow-y-scroll rounded-md bg-white dark:bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {frequencies.map(
                                                    (frequency) => (
                                                        <Listbox.Option
                                                            key={frequency.type}
                                                            value={frequency}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                    active
                                                                        ? 'bg-amber-900 text-amber-100'
                                                                        : 'text-gray-900 dark:text-slate-100'
                                                                }`
                                                            }
                                                        >
                                                            {frequency.type} -{' '}
                                                            {
                                                                frequency.description
                                                            }
                                                        </Listbox.Option>
                                                    )
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    {selectedFrequency?.type === 'Monthly' && (
                                        <div className="flex flex-col">
                                            <label>Day Of Month</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="28"
                                                placeholder="Between 1 and 28"
                                                className="px-4 py-2 bg-slate-700 rounded-md shadow-md"
                                                {...register('dayOfMonth', {
                                                    min: 0,
                                                    max: 28,
                                                })}
                                            />
                                        </div>
                                    )}
                                    {selectedFrequency?.type === 'Weekly' && (
                                        <div className="flex flex-col">
                                            <label>Day Of Week</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="7"
                                                className="px-4 py-2 bg-slate-700 rounded-md shadow-md"
                                                {...register('dayOfWeek', {
                                                    min: 0,
                                                    max: 7,
                                                })}
                                            />
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            // onClick={closeModal}
                                        >
                                            Add Expense
                                        </button>
                                        <button
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ml-4 focus-visible:ring-offset-2"
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
}
