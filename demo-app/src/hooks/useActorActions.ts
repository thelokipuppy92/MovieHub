import Actor from '../model/actor.model';
import { ActorService } from '../service/ActorService';
import { toast } from 'react-toastify';
interface UseActorActionsProps {
    setDataActors: React.Dispatch<React.SetStateAction<Actor[]>>;
    setSelectedActor: React.Dispatch<React.SetStateAction<Actor | null>>;
    selectedActor: Actor | null;
}

const useActorActions = ({ setDataActors, setSelectedActor, selectedActor }: UseActorActionsProps) => {

    const handleAddActor = async (actor: Actor) => {
        if (!actor.name) {
            toast.error("Name is required!");
            return;
        }
        if (actor.name.length < 3) {
            toast.error("Name should have at least 3 letters!");
            return;
        }
        if (!actor.email) {
            toast.error("Email is required!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(actor.email)) {
            toast.error("Invalid email format! Email must contain '@' and a valid domain.");
            return;
        }

        if (!actor.age) {
            toast.error("Age is required!");
            return;
        }
        try {
            const addedActor = await ActorService.addActor(actor);
            setDataActors(prevData => [...prevData, addedActor]);
            toast.success('Actor added successfully!');
        } catch (error) {
            console.error('Error adding actor:', error);
            toast.error('Failed to add actor.');
        }
    };

    const handleUpdateActor = async (actor: Actor) => {
        if (!selectedActor) return;
        try {
            await ActorService.updateActor(actor);
            setDataActors(prevData =>
                prevData.map(a => (a.id === selectedActor.id ? actor : a))
            );
            toast.success('Actor updated successfully!');
        } catch (error) {
            console.error('Error updating actor:', error);
            toast.error('Failed to update actor.');
        }
    };

    const handleDeleteActor = async () => {
        if (!selectedActor) return;
        try {
            await ActorService.deleteActor(selectedActor.id);
            setDataActors(prevData => prevData.filter(actor => actor.id !== selectedActor.id));
            setSelectedActor(null);
            toast.success('Actor deleted successfully!');
        } catch (error) {
            console.error('Error deleting actor:', error);
            toast.error('Failed to delete actor.');
        }
    };

    return { handleAddActor, handleUpdateActor, handleDeleteActor };
};

export default useActorActions;
