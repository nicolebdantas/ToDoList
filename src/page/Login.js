import React, {useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import { doc, setDoc, getDocs, collection, getFirestore } from "firebase/firestore";
import '../AuthStyles.css';
import ImageFetcher from '../components/imageFetcher';

 
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
            console.log(user);
            // Firestore logic to create a new collection for the user's UID if it doesn't exist
            const db = getFirestore();
            const userTasksCollection = collection(db, `userTasks_${user.uid}`);
            
            // You can add a sample task to this collection or any other initialization logic if needed
            console.log(userTasksCollection);
            // Fetch all documents from the user-specific collection
            const querySnapshot = await getDocs(userTasksCollection);

            // Check if the collection is empty
            if (querySnapshot.empty) {
                const sampleTaskDocRef = doc(userTasksCollection);
                const response = await setDoc(sampleTaskDocRef, {
                    // Sample task data
                    createdAt: new Date().toISOString(),
                    id: 1234,
                    listId: '1',
                    text: 'This is a sample task',
                    isComplete: false, // You can set this to false initially
                    isSubTask: false,
                    subtasks: []
                });
                console.log("Sample task added:", response);
            } else {
                console.log("Collection is not empty, sample task not added.");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
       
    }
 
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                
                    <ImageFetcher />
                    <h1>Nic's To Do</h1>
                </div>
                <div className="auth-body">
                    <form onSubmit={onLogin}>
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                className="auth-input"
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                className="auth-input"
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <button className="auth-button" type="submit">
                                Let's try today
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-center" style={{ color: 'white' }}>
                        No account yet? {' '}
                        <NavLink to="/signup" style={{ color: 'white' }}>
                            Sign up
                        </NavLink>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;