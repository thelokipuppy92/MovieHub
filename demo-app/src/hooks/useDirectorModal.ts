import { useState } from 'react';
import Director from '../model/director.model';

interface UseDirectorModalProps {
    selectedDirector: Director | null;
}

const useDirectorModal = ({ selectedDirector }: UseDirectorModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [newDirector, setNewDirector] = useState<Director>({
        id: '',
        name: '',
        email: '',
        age: 0,
    });


    const openModal = (update = false) => {
        setIsModalOpen(true);
        setIsUpdateMode(update);
        if (update && selectedDirector) {
            setNewDirector({ ...selectedDirector });
        } else {
            setNewDirector({ id: '', name: '', email: '', age:0 });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewDirector({ id: '', name: '', email: '', age:0 });
        setIsUpdateMode(false);
    };

    return {
        isModalOpen,
        isUpdateMode,
        newDirector,
        openModal,
        closeModal,
        setNewDirector,
    };
};

export default useDirectorModal;
