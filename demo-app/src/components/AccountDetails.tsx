import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonService } from '../service/PersonService.ts';
import { WatchlistService } from '../service/WatchlistService.ts';
import { toast } from 'react-toastify';

interface WatchlistItem {
    id: string;
    personId: string;
    personName: string;
    movieId: string;
    movieTitle: string;
    addedAt: string;
}

const AccountDetails = () => {
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
    const navigate = useNavigate();
    const [userData, setUserData] = useState({id: '', name: '', age: 0, email: '', password: ''});
    const [editing, setEditing] = useState(false);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);  // <-- state for watchlist

    const personId = sessionStorage.getItem('personId');

    useEffect(() => {
        if (!personId) {
            toast.error('User not logged in');
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const user = await PersonService.getPersonById(personId);
                setUserData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Error fetching user data');
            }
        };

        const fetchWatchlist = async () => {
            try {
                const watchlistData = await WatchlistService.getWatchlistByPersonId(personId);
                setWatchlist(watchlistData);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
                toast.error('Error fetching watchlist');
            }
        };

        fetchUserData();
        fetchWatchlist();
    }, [personId, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: name === 'age' ? Number(value) : value
        }));
    };

    const handleSave = async () => {
        if (!personId) {
            toast.error('User not logged in');
            return;
        }

        try {
            const personToUpdate = {...userData, id: personId};

            await PersonService.updatePerson(personToUpdate);

            setUserData(personToUpdate);

            toast.success('Account updated successfully');
            setEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Error updating account');
        }
    };

    const handleDeleteAccount = async () => {
        if (!personId) {
            toast.error('User not logged in');
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            await PersonService.deletePerson(personId);
            toast.success('Account deleted successfully');

            sessionStorage.clear();
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Error deleting account');
        }
    };


    return (
        <div
            className="app-container"
            style={{
                position: "relative",
                minHeight: "100vh",
                color: currentTheme === "dark" ? "#fff" : "#000",
            }}
        >
            {/* Background div with blur */}
            <div
                className="background-blur"
                style={{
                    backgroundImage: "url('/images/background2.jpg')",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center top 30%",
                    filter: "blur(8px) brightness(0.6)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: -1,
                }}
            />

            {/* Content container */}
            <div
                className="content-container"
                style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "20px",
                    maxWidth: "600px",
                    margin: "auto",
                    backgroundColor: "rgba(200, 200, 200, 0.85)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    marginTop: "40px",
                }}
            >
                <h2>My Account</h2>

                <div style={{marginBottom: "12px"}}>
                    <label htmlFor="name" style={{display: "block", marginBottom: "4px"}}>
                        Name:
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        disabled={!editing}
                        style={{
                            width: "100%",
                            maxWidth: "250px",
                            padding: "6px 10px",
                            fontSize: "1rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>

                <div style={{marginBottom: "12px"}}>
                    <label htmlFor="age" style={{display: "block", marginBottom: "4px"}}>
                        Age:
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        value={userData.age}
                        onChange={handleChange}
                        disabled={!editing}
                        style={{
                            width: "100%",
                            maxWidth: "100px",
                            padding: "6px 10px",
                            fontSize: "1rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>

                <div style={{marginBottom: "12px"}}>
                    <label htmlFor="email" style={{display: "block", marginBottom: "4px"}}>
                        Email:
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={!editing}
                        style={{
                            width: "100%",
                            maxWidth: "300px",
                            padding: "6px 10px",
                            fontSize: "1rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>

                {!editing ? (
                    <button onClick={() => setEditing(true)}>Edit</button>
                ) : (
                    <button onClick={handleSave}>Save</button>
                )}

                <button onClick={() => navigate("/dashboard")} style={{marginLeft: "8px"}}>
                    Back to Dashboard
                </button>

                <button onClick={handleDeleteAccount} style={{color: "red", marginLeft: "8px"}}>
                    Delete Account
                </button>

                <h3>My Watchlist</h3>
                {watchlist.length === 0 ? (
                    <p>Your watchlist is empty.</p>
                ) : (
                    <ul>
                        {watchlist.map((item) => (
                            <li key={item.id}>
                                <strong>{item.movieTitle}</strong> ({new Date(item.addedAt).toLocaleDateString()}) -
                                {item.released ? (
                                    <span style={{color: "green", marginLeft: "8px"}}>Released </span>
                                ) : (
                                    <span style={{color: "red", marginLeft: "8px"}}>Not Released </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

    export default AccountDetails;
