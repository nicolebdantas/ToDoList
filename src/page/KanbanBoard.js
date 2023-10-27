import React, { useState, useEffect } from "react";
import {DragDropContext} from "react-beautiful-dnd";
import TodoList from "../components/TodoList";
import { getAuth } from 'firebase/auth';
import { getFirestore, query, where, doc, orderBy, updateDoc, getDocs, collection, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you've exported your Firebase configuration as 'db'
import CatLoader from '../components/catLoader'
import { auth } from '../firebase';
import {  signOut } from "firebase/auth";

import { useNavigate } from 'react-router-dom';


export default function KanbanBoard(){
  const navigate = useNavigate; 
  const [loading, setLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // New state for forcing re-render
  const [listsRendered, setListsRendered] = useState(0);

  const handleListRendered = () => {
    setListsRendered(prev => prev + 1);
  };

  useEffect(() => {
    if (listsRendered === 3) { // Assuming you have 3 TodoList components
      setLoading(false);
    }
  }, [listsRendered]);

  const handleDragEnd = async (result) => {
    setLoading(true);
    const { destination, source, draggableId } = result;

    // Check if there's a destination
    if (!destination) {
        return;
    }

    // If the source and destination are the same, no need to proceed
    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Ensure there's a logged-in user
    if (!currentUser) {
        console.error('No authenticated user found.');
        return;
    }

    const userSpecificCollection = collection(db, `userTasks_${currentUser.uid}`);
    const taskQuery = query(userSpecificCollection, where("id", "==", draggableId));
    const taskSnapshot = await getDocs(taskQuery);

    if (taskSnapshot.empty) {
        console.error('No matching task found.');
        return;
    }

    const taskDoc = taskSnapshot.docs[0];

    try {
        // Update the listId of the task in Firestore
        await updateDoc(taskDoc.ref, {
            listId: destination.droppableId
        });
    } catch (error) {
        console.error('Error updating task: ', error);
    }
    setRenderKey(prevKey => prevKey + 1);

    setLoading(false);
};
const handleLogout = () => {               
  signOut(auth).then(() => {
  // Sign-out successful.
      navigate("/Signup");
      console.log("Signed out successfully")
  }).catch((error) => {
  // An error happened.
  });
}


return (
  <DragDropContext onDragEnd={handleDragEnd} key={renderKey}>
      <div style={{ position: 'relative', display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 className="title">Nicole's To-Do List App</h1>
          <h2 className="subTitle">Consider it a blessing you get to use this</h2>
          <button onClick={handleLogout} className='logout-button'>Give Up </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              {loading ? <CatLoader /> : null}
              <TodoList id={"1"} list_name={'To-do'} onRendered={handleListRendered} />
              <TodoList id={"2"} list_name={'Doing'} onRendered={handleListRendered} />
              <TodoList id={"3"} list_name={'Done'} onRendered={handleListRendered} />
          </div>
      </div>
  </DragDropContext>
);



}