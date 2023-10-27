import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../AuthStyles.css';
import ImageFetcher from '../components/imageFetcher';

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/login")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    
                    <ImageFetcher />
                    <h1>To Do App</h1>
                </div>
                <div className="auth-body">

                    <form onSubmit={onSubmit}>                                                                                            
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                className="auth-input"
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email address"                                
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                className="auth-input"
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password"              
                            />
                        </div>                                             
                        
                        <button className="auth-button" type="submit">
                            Sign up
                        </button>
                    </form>
                    <p style={{ color: 'white' }}>
                        Already have an account?{' '}
                        <NavLink to="/login" style={{ color: 'white' }}>
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;