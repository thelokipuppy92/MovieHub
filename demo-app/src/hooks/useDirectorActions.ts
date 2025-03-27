import Director from '../model/director.model';
import { DirectorService } from '../service/DirectorService';
import { toast } from 'react-toastify';
interface UseDirectorActionsProps {
    setDataDirectors: React.Dispatch<React.SetStateAction<Director[]>>;
    setSelectedDirector: React.Dispatch<React.SetStateAction<Director | null>>;
    selectedDirector: Director | null;
}

const useDirectorActions = ({ setDataDirectors, setSelectedDirector, selectedDirector }: UseDirectorActionsProps) => {

    const handleAddDirector = async (director: Director) => {
        if (!director.name) {
            toast.error("Name is required!");
            return;
        }
        if (director.name.length < 3) {
            toast.error("Name should have at least 3 letters!");
            return;
        }
        if (!director.email) {
            toast.error("Email is required!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(director.email)) {
            toast.error("Invalid email format! Email must contain '@' and a valid domain.");
            return;
        }
        if (!director.age) {
            toast.error("Age is required!");
            return;
        }
        try {
            const addedDirector = await DirectorService.addDirector(director);
            setDataDirectors(prevData => [...prevData, addedDirector]);
            toast.success('Director added successfully!');
        } catch (error) {
            console.error('Error adding director:', error);
            toast.error('Failed to add director!');
        }
    };

    const handleUpdateDirector = async (director: Director) => {
        if (!selectedDirector) return;
        try {
            await DirectorService.updateDirector(director);
            setDataDirectors(prevData =>
                prevData.map(d => (d.id === selectedDirector.id ? director : d))
            );
            toast.success('Director updated successfully!')
        } catch (error) {
            console.error('Error updating director:', error);
            toast.error('Failed to update director!');
        }
    };

    const handleDeleteDirector = async () => {
        if (!selectedDirector) return;

        try {
            await DirectorService.deleteDirector(selectedDirector.id);
            setDataDirectors(prevData => prevData.filter(director => director.id !== selectedDirector.id));
            setSelectedDirector(null); // Clear selected director
            toast.success('Director deleted successfully!');
        } catch (error) {
            console.error('Error deleting director:', error);

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to delete director. Ensure it is not linked to any movie.');
            }
        }
    };


    return { handleAddDirector, handleUpdateDirector, handleDeleteDirector };
};

export default useDirectorActions;
