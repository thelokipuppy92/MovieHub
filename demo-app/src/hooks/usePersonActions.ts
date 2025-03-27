import Person from '../model/person.model';
import { PersonService } from '../service/PersonService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UsePersonActionsProps {
    setData: React.Dispatch<React.SetStateAction<Person[]>>;
    setSelectedPerson: React.Dispatch<React.SetStateAction<Person | null>>;
    selectedPerson: Person | null;
}

const usePersonActions = ({ setData, setSelectedPerson, selectedPerson }: UsePersonActionsProps) => {

    const handleAddPerson = async (person: Person) => {
        if (!person.name) {
            toast.error("Name is required!");
            return;
        }
        if (person.name.length < 3) {
            toast.error("Name should have at least 3 letters!");
            return;
        }
        if (!person.email) {
            toast.error("Email is required!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(person.email)) {
            toast.error("Invalid email format! Email must contain '@' and a valid domain.");
            return;
        }
        if (!person.age) {
            toast.error("Age is required!");
            return;
        }

        try {
            const addedPerson = await PersonService.addPerson(person);
            setData(prevData => [...prevData, addedPerson]);
            toast.success('Person added successfully!');
        } catch (error) {
            console.error('Error adding person:', error);
            toast.error('Failed to add person.');
        }
    };

    const handleUpdatePerson = async (person: Person) => {
        if (!selectedPerson) return;

        try {
            await PersonService.updatePerson(person);
            setData(prevData =>
                prevData.map(p => (p.id === selectedPerson.id ? person : p))
            );
            toast.success('Person updated successfully!');
        } catch (error) {
            console.error('Error updating person:', error);
            toast.error('Failed to update person.');
        }
    };

    const handleDeletePerson = async () => {
        if (!selectedPerson) return;

        try {
            await PersonService.deletePerson(selectedPerson.id);
            setData(prevData => prevData.filter(person => person.id !== selectedPerson.id));
            setSelectedPerson(null);
            toast.success('Person deleted successfully!');
        } catch (error) {
            console.error('Error deleting person:', error);
            toast.error('Failed to delete person.');
        }
    };

    return { handleAddPerson, handleUpdatePerson, handleDeletePerson };
};

export default usePersonActions;
