import { trpc } from '../../../../utils/trpc';
interface DeleteExpenseProps {
    id: number;
    closeModal: () => void;
}
export const DeleteExpense = ({ id, closeModal }: DeleteExpenseProps) => {
    const utils = trpc.useContext();
    const mutation = trpc.useMutation(['expense.delete'], {
        onSuccess: () => {
            utils.invalidateQueries(['expense.getAll']);
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
