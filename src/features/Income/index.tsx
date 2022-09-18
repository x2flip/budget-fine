import { Dispatch, SetStateAction, useState, Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Income } from '@prisma/client';
import { payPeriods } from './PayPeriods/PayPeriods';
import { trpc } from '../../utils/trpc';

interface AddIncomeDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}
type AddIncomeInputs = {
    title: string;
    amount: number;
    payPeriod: string;
};

export function AddIncomeDialog({ isOpen, setIsOpen }: AddIncomeDialogProps) {
    const utils = trpc.useContext();
    const mutation = trpc.useMutation(['income.create'], {
        onSuccess: () => {
            utils.invalidateQueries(['income.getAll']);
            setIsOpen(false);
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddIncomeInputs>();

    const [selectedPayPeriod, setSelectedPayPeriod] = useState(payPeriods[0]);
    const onSubmit: SubmitHandler<AddIncomeInputs> = (data) => {
        let newIncome = {
            title: data.title,
            amount: Number(data.amount),
            payPeriod: selectedPayPeriod?.type || 'Semi-Monthly',
        };
        console.log(newIncome);
        mutation.mutate(newIncome);
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden space-y-6 rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-medium leading-6 text-gray-900 dark:text-slate-100"
                                >
                                    Add Income
                                </Dialog.Title>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="flex flex-col text-slate-100 space-y-4"
                                >
                                    <div className="flex flex-col">
                                        <label className="">Title</label>
                                        <input
                                            className="py-2 px-4 bg-slate-700 shadow-md rounded-md"
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
                                            className="py-2 px-4 bg-slate-700 shadow-md rounded-md"
                                            {...register('amount', {
                                                min: 0,
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <Listbox
                                            value={selectedPayPeriod}
                                            onChange={setSelectedPayPeriod}
                                        >
                                            <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white dark:bg-slate-700 py-2 px-4 text-left shadow-md">
                                                {selectedPayPeriod?.type}
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {payPeriods.map((period) => (
                                                    <Listbox.Option
                                                        key={period.type}
                                                        value={period}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                active
                                                                    ? 'bg-amber-900 text-amber-100'
                                                                    : 'text-gray-900 dark:bg-slate-100'
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

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            Add Income
                                        </button>
                                        <button
                                            // type="submit"
                                            className="inline-flex ml-4 justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
