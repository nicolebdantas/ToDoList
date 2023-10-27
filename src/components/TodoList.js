import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import SubTaskList from './SubTaskList';
import Todo from './Todo';
import ImageFetcher from './imageFetcher';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, query, where, doc, orderBy, updateDoc, getDocs, collection, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you've exported your Firebase configuration as 'db'


import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import {  signOut } from "firebase/auth";
import { Droppable } from 'react-beautiful-dnd';
 

function TodoList(props) {
  const columnId = props.id;
  console.log(columnId);

  useEffect(() => {
    // This listener is triggered whenever the user's authentication state changes
    const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user);
            fetchTodos();
            // You can fetch the todos here or set some state to indicate the user is authenticated
        } else {
            // User is signed out
            console.log('User is signed out');
            navigate("/Signup"); // Redirect to the signup or login page
        }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);


  console.log("TodoList component rendered");

    const navigate = useNavigate();
 

    const [todos, setTodos] = useState([]);

    const fetchTodos = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

        // Ensure there's a logged-in user
        if (!currentUser) {
            console.error('No authenticated user found.');
            return;
        }

        const userSpecificCollection = collection(db, `userTasks_${currentUser.uid}`);

        try {
            // Retrieve all documents from the user-specific collection
            const userSpecificCollection = collection(db, `userTasks_${currentUser.uid}`);
            const orderedQuery = query(userSpecificCollection, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(orderedQuery);

            // Convert the query results into an array of todos
            const userTodos = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(todo => !todo.isSubTask && todo.listId === columnId);

            // Update the todos state
            console.log(userTodos);
            setTodos(userTodos);
        } catch (error) {
            console.error('Error fetching todos: ', error);
        }
        props.onRendered();
    };

  useEffect(() => {
      console.log('use effect ran')
      fetchTodos();
  }, []);

  const addTodo = async(todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
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

    try {
      console.log('trying to add task to db')
        const docRef = await addDoc(userSpecificCollection, {
          createdAt: new Date().toISOString(),
          id: String(todo.id),
          listId: columnId,
          text: todo.text,
          isComplete: false, // You can set this to false initially
          isSubTask: false,
          subtasks: []
        });
    
        fetchTodos();

      } 
    catch (error) {
        console.error('Error adding document: ', error);
      }

    console.log(...todos);
  };

  const updateTodo = async (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
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
    const todoQuery = query(userSpecificCollection, where("id", "==", todoId));

    try {
        // Query Firestore for the todo with the matching id
        const querySnapshot = await getDocs(todoQuery);

        if (!querySnapshot.empty) {
            const todoDoc = querySnapshot.docs[0];
            
            // Update the document in Firestore
            await updateDoc(todoDoc.ref, {
                text: newValue.text,
                // Add any other fields you want to update here, but exclude the id
            });

            // Update the local state
            //setTodos(prev => prev.map(item => (item.id === todoId ? { ...item, text: newValue.text } : item)));
            fetchTodos();
        } else {
            console.error('Todo not found in Firestore.');
        }
    } catch (error) {
        console.error('Error updating document: ', error);
    }
};

  const removeTodo = async id => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Ensure there's a logged-in user
    if (!currentUser) {
        console.error('No authenticated user found.');
        return;
    }

    const userSpecificCollection = collection(db, `userTasks_${currentUser.uid}`);
    const todoQuery = query(userSpecificCollection, where("id", "==", id));

    try {
        // Query Firestore for the todo with the matching id
        const querySnapshot = await getDocs(todoQuery, orderBy("createdAt", "asc"));

        if (!querySnapshot.empty) {
            const todoDoc = querySnapshot.docs[0];
            const currentTodo = todoDoc.data();

            // Retrieve the subtasks list from the main todo document
            const subtasks = currentTodo.subtasks || [];

            // Loop through the subtasks list and delete each subtask document
            for (let subtaskId of subtasks) {
                const subtaskQuery = query(userSpecificCollection, where("id", "==", subtaskId));
                const subtaskQuerySnapshot = await getDocs(subtaskQuery, orderBy("createdAt", "asc"));

                if (!subtaskQuerySnapshot.empty) {
                    const subtaskDoc = subtaskQuerySnapshot.docs[0];
                    await deleteDoc(subtaskDoc.ref);
                }
            }

            // Delete the main todo document
            await deleteDoc(todoDoc.ref);

            // Update the local state
            const removedArr = [...todos].filter(todo => todo.id !== id);
            setTodos(removedArr);
        } else {
            console.error('Todo not found in Firestore.');
        }
    } catch (error) {
        console.error('Error removing document: ', error);
    }
};

  const completeTodo = async id => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Ensure there's a logged-in user
    if (!currentUser) {
        console.error('No authenticated user found.');
        return;
    }

    const userSpecificCollection = collection(db, `userTasks_${currentUser.uid}`);
    const todoQuery = query(userSpecificCollection, where("id", "==", id));


    try {
      const querySnapshot = await getDocs(todoQuery, orderBy("createdAt", "asc"));

      if (!querySnapshot.empty) {
          const todoDoc = querySnapshot.docs[0];
          const currentTodo = todoDoc.data();

          // Toggle the isComplete field
          const updatedIsComplete = !currentTodo.isComplete;

          // Reflect this change in the local state
          let updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.isComplete = updatedIsComplete;
            }
            return todo;
           });
          // Update the document in Firestore
          await updateDoc(todoDoc.ref, {
              isComplete: updatedIsComplete
          });

          
          setTodos(updatedTodos);
      } else {
          console.error('Todo not found in Firestore.');
      }
    } catch (error) {
        console.error('Error updating todo in Firestore: ', error);
    }
};

  return (
    <Droppable droppableId={columnId} className='droppable'>
      {(provided, snapshot) => (
      <div className='todo-list'
            ref={provided.innerRef}
            {...provided.droppableProps}
            isdraggingover={snapshot.isDraggingOver.toString()}>
      <h1>{props.list_name}</h1>
      
      <ImageFetcher />
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
      {provided.placeholder}
    </div>
      )}
    </Droppable>
    
  );
}

export default TodoList;