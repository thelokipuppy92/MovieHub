import React, { useEffect, useState } from 'react';
import Actor from '../model/actor.model';
import { ActorService } from '../service/ActorService';
import Movie from "../model/movie.model.tsx";
import {MovieService} from "../service/MovieService.ts";
import { toast } from 'react-toastify';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    movie: Movie | null;
}

function ActorSelectionModal({ isOpen, onClose, movie }: Props) {
    const [actors, setActors] = useState<Actor[]>([]);
    const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchActors();
        }
    }, [isOpen]);

    const fetchActors = async () => {
        try {
            const data = await ActorService.getActors();
            setActors(data);
        } catch (err) {
            console.error('Failed to fetch actors:', err);
        }
    };

    const toggleActorSelection = (actorId: string) => {
        setSelectedActorIds((prev) =>
            prev.includes(actorId)
                ? prev.filter((id) => id !== actorId)
                : [...prev, actorId]
        );
    };

    const handleAssign = async () => {
        try {
            if (movie && selectedActorIds.length > 0) {
                await MovieService.assignActorsToMovie(movie.id, selectedActorIds);
                onClose();
                toast.success('Actors assigned successfully!');
            } else {
                alert('Please select at least one actor');
            }
        } catch (error) {
            console.error('Error assigning actors:', error);
            alert('Failed to assign actors to the movie');
            toast.error('Failed to assign actor/actors to movie!')
        }
    };



    if (!isOpen || !movie) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Assign Actors to "{movie.title}"</h2>
                <ul>
                    {actors.map((actor) => (
                        <li key={actor.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedActorIds.includes(actor.id)}
                                    onChange={() => toggleActorSelection(actor.id)}
                                />
                                {actor.name} ({actor.email})
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="modal-buttons">
                    <button onClick={handleAssign}>Assign Selected Actors</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ActorSelectionModal;
