import React, { useState, useEffect } from 'react';
import Director from "../model/director.model";

interface DirectorModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialDirector: Director;
    onClose: () => void;
    onAdd: (director: Director) => Promise<void>;
    onUpdate: (director: Director) => Promise<void>;
}

function DirectorModal({ isOpen, isUpdateMode, initialDirector, onClose, onAdd, onUpdate }: DirectorModalProps) {
    const [director, setDirector] = useState<Director>(initialDirector);

    useEffect(() => {
        setDirector(initialDirector);
    }, [initialDirector]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDirector((prev) => ({
            ...prev,
            [name]: name === 'age' ? (value ? parseInt(value) : 0) : value,
        }));
    };


    const handleSubmit = async () => {
        if (isUpdateMode) {
            await onUpdate(director);
            window.dispatchEvent(new CustomEvent('directorListUpdated'));
        } else {
            await onAdd(director);
            //  Dispatch custom event to notify MovieModal
            window.dispatchEvent(new Event('directorListUpdated'));
        }
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isUpdateMode ? 'Update Director' : 'Add Director'}</h2>
                {isUpdateMode && (
                    <input
                        type="text"
                        name="id"
                        placeholder="ID"
                        value={director.id}
                        disabled
                    />
                )}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={director.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={director.email || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={director.age}
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

export default DirectorModal;
