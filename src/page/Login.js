import React, {useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import { doc, setDoc, getDocs, collection, getFirestore } from "firebase/firestore";

 
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
 
    return(
        <>
            <main >        
                <section>
                    <div>                                            
                        <p> Nic's To Do </p>                       
                                                       
                        <form>                                              
                            <div>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                                                
                            <div>
                                <button                                    
                                    onClick={onLogin}                                        
                                >      
                                    Let's try today                                                                  
                                </button>
                            </div>                               
                        </form>
                       
                        <p className="text-sm text-white text-center">
                            No account yet? {' '}
                            <NavLink to="/signup">
                                Sign up
                            </NavLink>
                        </p>
                                                   
                    </div>
                </section>
            </main>
        </>
    )
}
 
export default Login