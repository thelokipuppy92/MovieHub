import React, { useState, useEffect } from 'react';
import Actor from "../model/actor.model";

interface ActorModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialActor: Actor;
    onClose: () => void;
    onAdd: (actor: Actor) => Promise<void>;
    onUpdate: (actor: Actor) => Promise<void>;
}

function ActorModal({ isOpen, isUpdateMode, initialActor, onClose, onAdd, onUpdate }: ActorModalProps) {
    const [actor, setActor] = useState<Actor>(initialActor);


    useEffect(() => {
        setActor(initialActor);
    }, [initialActor]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setActor((prev) => ({
            ...prev,
            [name]: name === "age" ? Number(value) : value,
        }));
    };


    const handleSubmit = async () => {
        if (isUpdateMode) {
            await onUpdate(actor);
        } else {
            await onAdd(actor);
        }
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isUpdateMode ? 'Update Actor' : 'Add Actor'}</h2>
                {isUpdateMode && (
                    <input
                        type="text"
                        name="id"
                        placeholder="ID"
                        value={actor.id}
                        disabled
                    />
                )}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={actor.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={actor.email}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={actor.age}
                    onChange={handleInputChange}
                />
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>
                        {isUpdateMode ? 'Update' : 'Add'}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ActorModal;
