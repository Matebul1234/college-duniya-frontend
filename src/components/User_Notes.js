import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import '../assets/login.css';

const User_Notes = () => {
    // const api = process.env.REACT_APP_API_URL;
    const api = "http://localhost:8080";
    const [loginuser, setLoignUser] = useState();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [editvisible, seteditVisible] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [token, setToken] = useState();
    const [Notes, setNotes] = useState([]);
    const [notesInfo, setNotesInfo] = useState({
        title: '',
        content: '',
        category: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotesInfo((prevNotesInfo) => ({
            ...prevNotesInfo,
            [name]: value, // Update the specific field in notesInfo
        }));
    };


    const formSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        const { title, content, category } = notesInfo;
        // const token = localStorage.getItem('token')

        if (!title || !content || !category) {
            toast.error("Titel & category are required !");
            return;
        }
        // Simple validation

        try {
            // const url = `${api}/notes/add-notes`;
            const url = 'http://localhost:8080/notes/add-notes'
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(notesInfo)
            })
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                toast.success("Note added successfully");
                setVisible(false)

            } else if (error) {
                const details = error?.details[0].message;
                toast.error(details)
            } else if (!success) {
                toast.error(message)
            }
        } catch (error) {
            toast.error("somethig went wrong", error)
            return;
        }
        // Mock API call or send data to backend

    };

    // get all notes
    const getAllNotes = async (e) => {

        const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

        try {
            const url = "http://localhost:8080/notes/all-notes";

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                // Handle errors such as unauthorized or not found
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to fetch notes");
                return;
            }

            const data = await response.json();

            if (data.success) {
                // console.log("Notes Data:", data.data);
                setNotes(data.data);
            } else {
                toast.error(data.message || "Failed to fetch notes");
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            toast.error("Something went wrong while fetching notes");
        }
    };

    const deleteNote = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            const response = await fetch(`http://localhost:8080/notes/delete-note/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Note deleted successfully!");
                getAllNotes(); // Refresh the notes list
            } else {
                toast.error(result.message || "Failed to delete note");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Something went wrong while deleting the note");
        }
    };

    // Handle Edit
    const editNote = (note) => {
        console.log(note, "edit data");
        setCurrentNoteId(note._id);
        seteditVisible(true);
        setNotesInfo({
            title: note.title,
            content: note.content,
            category: note.category
        })
        // toast.info(`Edit Note: ${id}`);
    };

    const editUserNotes = async (e) => {
        e.preventDefault(); // Prevent page refresh
        try {
            const url = `${api}/notes/update-note/${currentNoteId}`; // Use the captured ID
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(notesInfo)
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Note updated successfully");
                getAllNotes(); // Refresh the list
                seteditVisible(false); // Close the dialog
            } else {
                toast.error(result.message || "Failed to update note");
            }
        } catch (error) {
            toast.error("Something went wrong while updating the note");
        }
    };

    useEffect(() => {
        setLoignUser(localStorage.getItem('loggedInUser'));
        setToken(localStorage.getItem('token'));
        // get all notes
        getAllNotes();

    }, [])

    const logoutuser = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('token');
        toast.warn('user logout successfully');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Left-aligned text */}
                    <Link className="navbar-brand" to="/notes">
                        Welcome to College Duniya: {loginuser}
                    </Link>

                    {/* Right-aligned logout button */}
                    <div className="d-flex">
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={logoutuser}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <div className="d-flex p-3">
                <button className="btn btn-md bg-primary text-light" onClick={() => setVisible(true)}>Add Notes</button>
            </div>
            {/* dialog box for open add notes form  */}

            <div className="card flex justify-content-center">
                <Dialog header="Add Notes " visible={visible} maximizable style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} >
                    <div className="login-form w-100">
                        <form onSubmit={formSubmit} w-50>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter Titel" name='title' value={notesInfo.title} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    name="category"
                                    value={notesInfo.category}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select category</option>
                                    <option value="Work">Work</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <textarea type="text" className="form-control" placeholder="Enter content.. " name='content' value={notesInfo.content} onChange={handleChange} />
                            </div>


                            <input type="submit" className="btn btn-primary btn-block btn-lg w-100" value="Submit" />
                        </form>

                    </div>
                </Dialog>
            </div>
            {/* Editable data */}
            <div className="card flex justify-content-center">
                <Dialog header="Edit Notes " visible={editvisible} maximizable style={{ width: '50vw' }} onHide={() => { if (!editvisible) return; seteditVisible(false); }} >
                    <div className="login-form w-100">
                        <form onSubmit={editUserNotes} w-50>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter Titel" name='title' value={notesInfo.title} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    name="category"
                                    value={notesInfo.category}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select category</option>
                                    <option value="Work">Work</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <textarea type="text" className="form-control" placeholder="Enter content.. " name='content' value={notesInfo.content} onChange={handleChange} />
                            </div>


                            <input type="submit" className="btn btn-primary btn-block btn-lg w-100" value="Update" />
                        </form>

                    </div>
                </Dialog>
            </div>

            {/* table */}
            <div className="container mt-2">
                <h3 className="mb-2">Notes List</h3>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Content</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Notes && Notes.length > 0 ? (
                                Notes.map((note, index) => (
                                    <tr key={note._id}>
                                        <td>{index + 1}</td>
                                        <td>{note.title}</td>
                                        <td>{note.category}</td>
                                        <td>{note.content}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => editNote(note)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteNote(note._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No Notes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="toastdiv">
                <ToastContainer />
            </div>
        </>
    )
}

export default User_Notes