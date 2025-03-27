import { useState } from 'react';
import Person from '../model/person.model';

interface UsePersonModalProps {
    selectedPerson: Person | null;
}

const usePersonModal = ({ selectedPerson }: UsePersonModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [newPerson, setNewPerson] = useState<Person>({ id: '', name: '', age: 0, email: '' });

    const openModal = (update = false) => {
        setIsModalOpen(true);
        setIsUpdateMode(update);
        if (update && selectedPerson) {
            setNewPerson({ ...selectedPerson });
        } else {
            setNewPerson({ id: '', name: '', age: 0, email: '' });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewPerson({ id: '', name: '', age: 0, email: '' });
        setIsUpdateMode(false);
    };

    return {
        isModalOpen,
        isUpdateMode,
        newPerson,
        openModal,
        closeModal,
        setNewPerson,
    };
};

export default usePersonModal;