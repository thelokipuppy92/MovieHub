// components/PersonModal.tsx
import React, { useState, useEffect } from 'react';
import Person from "../model/person.model";

interface PersonModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialPerson: Person;
    onClose: () => void;
    onAdd: (person: Person) => Promise<void>;
    onUpdate: (person: Person) => Promise<void>;
}

function PersonModal({ isOpen, isUpdateMode, initialPerson, onClose, onAdd, onUpdate }: PersonModalProps) {
    const [person, setPerson] = useState<Person>(initialPerson);

    useEffect(() => {
        setPerson(initialPerson);
    }, [initialPerson]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPerson((prev) => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async () => {
        if (isUpdateMode) {
            await onUpdate(person);
        } else {
            await onAdd(person);
        }
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isUpdateMode ? 'Update Person' : 'Add Person'}</h2>
                {isUpdateMode && (
                    <input
                        type="text"
                        name="id"
                        placeholder="ID"
                        value={person.id}
                        disabled
                    />
                )}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={person.name}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={person.age}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={person.email}
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

export default PersonModal;