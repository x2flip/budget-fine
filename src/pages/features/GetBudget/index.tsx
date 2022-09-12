import { Dialog, Listbox, Transition } from '@headlessui/react';
import { Dispatch, SetStateAction, Fragment, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { trpc } from '../../../utils/trpc';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Income } from '@prisma/client';
import { NextCheck } from './NextCheck';
import { format } from 'date-fns';

interface DialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    incomes: Income[] | undefined;
}
interface BuildBudgetInputs {
    baseAmount: number;
    cutoffDate: Date;
}
export function GetBudgetModal({ isOpen, setIsOpen, incomes }: DialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BuildBudgetInputs>();
    const [baseAmount, setBaseAmount] = useState(0);
    const [cutoff, setCutoff] = useState(new Date());

    const budgetData = trpc.useQuery([
        'budget.getBudget',
        { baseAmount, cutoff },
    ]);
    console.log(budgetData.data);
    function closeModal() {
        setIsOpen(false);
    }
    const onSubmit: SubmitHandler<BuildBudgetInputs> = (data) => {
        setBaseAmount(Number(data.baseAmount));
        console.log(data);
    };
    // console.log(data);
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
                            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white flex flex-col space-y-2 overflow-y-scroll h-96 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Build Budget
                                </Dialog.Title>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="mt-2 flex flex-col space-y-4"
                                >
                                    <div className="flex flex-col">
                                        <label>Initial Amount</label>
                                        <input
                                            type={'number'}
                                            className="border py-1 px-2"
                                            {...register('baseAmount', {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label>Cutoff</label>
                                        <DatePicker
                                            className="border py-1 px-2 w-full"
                                            selected={cutoff}
                                            onChange={(date: Date) =>
                                                setCutoff(date)
                                            }
                                        />
                                    </div>
                                    {/* <div>
                                        {incomes?.map((income) => (
                                            <NextCheck
                                                key={income.id}
                                                title={income.title}
                                            />
                                        ))}
                                    </div> */}

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            Build Budget
                                        </button>
                                        <button
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ml-4 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                                <div className="overflow-y-scroll border">
                                    {budgetData.data &&
                                        budgetData.data.map(
                                            (date: {
                                                date: Date;
                                                net: Number;
                                            }) => (
                                                <div>
                                                    <span>
                                                        {format(
                                                            date.date,
                                                            'MM/dd'
                                                        )}
                                                        - Net: {date.net}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
