import { useState } from 'react';
import Actor from '../model/actor.model';

interface UseActorModalProps {
    selectedActor: Actor | null;
}

const useActorModal = ({ selectedActor }: UseActorModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [newActor, setNewActor] = useState<Actor>({
        id: '',
        name: '',
        email: '',
        age: 0,
    });

    const openModal = (update = false) => {
        setIsModalOpen(true);
        setIsUpdateMode(update);
        if (update && selectedActor) {
            setNewActor({ ...selectedActor });
        } else {
            setNewActor({ id: '', name: '', email: '', age: 0 });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewActor({ id: '', name: '', email: '', age: 0 });
        setIsUpdateMode(false);
    };

    return {
        isModalOpen,
        isUpdateMode,
        newActor,
        openModal,
        closeModal,
        setNewActor,
    };
};

export default useActorModal;
