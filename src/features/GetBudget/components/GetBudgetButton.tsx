import { Dispatch, SetStateAction } from 'react';

interface IProps {
    setIsGetBudgetModalOpen: Dispatch<SetStateAction<boolean>>;
}
export const GetBudgetButton = ({ setIsGetBudgetModalOpen }: IProps) => {
    return (
        <button
            onClick={() => setIsGetBudgetModalOpen(true)}
            className="border-2 border-cyan-400 py-4 text-cyan-400 shadow-xl shadow-cyan-400/20 rounded-md"
        >
            Get Budget!
        </button>
    );
};
