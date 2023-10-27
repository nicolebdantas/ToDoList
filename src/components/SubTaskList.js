import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { getAuth } from 'firebase/auth';
import { getFirestore, query, where, doc, orderBy, updateDoc, getDocs, collection, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you've exported your Firebase configuration as 'db'


function SubTasklist(props) {


  const [todos, setTodos] = useState([]);

  const parentID = props.edit.id;

  

  const fetchSubTasks = async () => {
    const mainTaskId = parentID;
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Ensure there's a logged-in user
    if (!currentUser) {
        console.error('No authenticated user found.');
        return [];
    }

    const userSpecificCollection = collection(db, `userTasks_${currentUser.uid}`);
    const mainTaskQuery = query(userSpecificCollection, where("id", "==", mainTaskId));

    try {
        // Query Firestore for the main task with the provided id
        const mainTaskSnapshot = await getDocs(mainTaskQuery);

        if (!mainTaskSnapshot.empty) {
            const mainTaskDoc = mainTaskSnapshot.docs[0];
            const subtaskIds = mainTaskDoc.data().subtasks || [];

            // Fetch all subtasks using the retrieved list of subtask IDs
            const subTasks = [];
            for (let subtaskId of subtaskIds) {
                const subtaskQuery = query(userSpecificCollection, where("id", "==", subtaskId));
                const subtaskSnapshot = await getDocs(subtaskQuery);

                if (!subtaskSnapshot.empty) {
                    const subtaskDoc = subtaskSnapshot.docs[0];
                    subTasks.push({ id: subtaskDoc.id, ...subtaskDoc.data() });
                }
            }
            setTodos(subTasks);
            return subTasks;
        } else {
            console.error('Main task not found in Firestore.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching subtasks: ', error);
        return [];
    }
  };


  useEffect(() => {
    console.log('use effect ran')
    fetchSubTasks();
}, []);
  

  const addSubTask = async(todo) => {
    const mainTaskId = parentID;
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
    const mainTaskQuery = query(userSpecificCollection, where("id", "==", mainTaskId));
    const mainTaskSnapshot = await getDocs(mainTaskQuery);

    try {
      console.log('trying to add task to db')
        const docRef = await addDoc(userSpecificCollection, {
          createdAt: new Date().toISOString(),
          id: String(todo.id),
          text: todo.text,
          isComplete: false, // You can set this to false initially
          isSubTask: true,
          subtasks: []
        });
      
      console.log('trying to update parent');

      const mainTaskDoc = mainTaskSnapshot.docs[0];
      // Fetch the current list of subtasks from the parent document
      const currentSubtasks = mainTaskDoc.data().subtasks || [];
        
      // Append the new subtask's ID to this list
      const updatedSubtasks = [...currentSubtasks, String(todo.id)];

      // Update the parent document with the new list
      await updateDoc(mainTaskDoc.ref, {
          subtasks: updatedSubtasks
      });



    
      fetchSubTasks();

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
            fetchSubTasks();
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
    <>
      <h1>Add a Sub Task?</h1>
      <TodoForm onSubmit={addSubTask} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default SubTasklist;