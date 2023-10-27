import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import TodoList from '../components/TodoList';
import {  signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';
 
const Home = () => {
  console.log('home runs')
    const navigate = useNavigate();
 
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              
              console.log("uid", uid)
            } else {
              // User is signed out
              
              console.log("user is logged out")
              navigate("/Signup");
            }
          });
         
    }, [])
 
  return (
    <div >
      <KanbanBoard />
    </div>
  );
}
 
export default Home
 