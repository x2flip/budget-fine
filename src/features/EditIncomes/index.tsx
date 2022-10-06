import { Dialog, Listbox, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { payPeriods } from '../Income/PayPeriods/PayPeriods';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { trpc } from '../../utils/trpc';
import { DeleteIncome } from '../Income/DeleteIncome';
import { Income } from '@prisma/client';

interface EditIncomeDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    income: Income;
}
interface EditIncomeInputs {
    title?: string;
    amount?: number;
    payPeriod?: string;
    // nextPaycheck?: Date;
}
export const EditIncomeDialog = ({
    isOpen,
    setIsOpen,
    income,
}: EditIncomeDialogProps) => {
    const { id, title, amount, payPeriod, nextPaycheck } = income;
    const [nextCheckDate, setNextCheckDate] = useState<Date | null>(
        nextPaycheck
    );
    const utils = trpc.useContext();
    const mutation = trpc.useMutation(['income.edit'], {
        onSuccess: () => {
            utils.invalidateQueries(['income.getAll']);
            setIsOpen(false);
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditIncomeInputs>();

    const [selectedPayPeriod, setSelectedPayPeriod] = useState(payPeriods[0]);
    const onSubmit: SubmitHandler<EditIncomeInputs> = (data) => {
        const { amount, ...rest } = data;
        let changedIncome = {
            id,
            amount: Number(amount),
            nextPaycheck: nextCheckDate,
            ...rest,
        };

        console.log(changedIncome);
        mutation.mutate(changedIncome);
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
                                    <DeleteIncome
                                        id={id}
                                        closeModal={closeModal}
                                    />
                                </div>
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-medium leading-6 text-gray-900 dark:text-slate-100"
                                >
                                    Edit Income
                                </Dialog.Title>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="mt-2 flex flex-col space-y-4"
                                >
                                    <div className="flex flex-col">
                                        <label className="dark:text-slate-100">
                                            Title
                                        </label>
                                        <input
                                            defaultValue={title}
                                            className="dark:bg-slate-700 py-2 px-4 dark:text-slate-100 rounded-md"
                                            {...register('title', {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="dark:text-slate-100">
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="dark:bg-slate-700 py-2 px-4 rounded-md dark:text-slate-100"
                                            {...register('amount', {
                                                min: 0,
                                                required: true,
                                                value: amount,
                                            })}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="dark:text-slate-100">
                                            Cadence
                                        </label>
                                        <Listbox
                                            value={selectedPayPeriod}
                                            onChange={setSelectedPayPeriod}
                                        >
                                            <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white dark:bg-slate-700 dark:text-slate-100 z-20 px-4 py-2 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                {selectedPayPeriod?.type}
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white z-10 dark:bg-slate-700 dark:text-slate-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                                                {payPeriods.map((period) => (
                                                    <Listbox.Option
                                                        key={period.type}
                                                        value={period}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                                active
                                                                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-slate-100'
                                                                    : 'text-gray-900 dark:text-slate-100'
                                                            }`
                                                        }
                                                    >
                                                        {period.type} -{' '}
                                                        {period.description}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="dark:text-slate-100">
                                            Next Check
                                        </label>
                                        <DatePicker
                                            className="dark:bg-slate-700 py-2 w-full px-4 dark:text-slate-100 rounded-md"
                                            selected={nextCheckDate}
                                            onChange={(date: Date) =>
                                                setNextCheckDate(date)
                                            }
                                        />
                                    </div>

                                    <div className="mt-4 flex justify-between">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border-2 border-blue-200 px-4 py-2 text-sm font-medium text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            {mutation.isLoading
                                                ? 'Saving...'
                                                : 'Save'}
                                        </button>
                                        <button
                                            // type="submit"
                                            className="inline-flex ml-4 justify-center rounded-md border-2 border-red-300 px-4 py-2 text-sm font-medium text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
