import { trpc } from '../../../utils/trpc';

interface DeleteIncomeProps {
    id: number;
    closeModal: () => void;
}
export const DeleteIncome = ({ id, closeModal }: DeleteIncomeProps) => {
    const utils = trpc.useContext();
    const mutation = trpc.useMutation(['income.delete'], {
        onSuccess: () => {
            utils.invalidateQueries(['income.getAll']);
            closeModal();
        },
    });
    return (
        <button
            onClick={() => mutation.mutate({ id })}
            className="text-red-500 text-sm"
        >
            {mutation.isLoading ? 'Deleting...' : 'Delete'}
        </button>
    );
};
