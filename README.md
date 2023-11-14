# ToDoList Application

## Demo Link: 
https://www.loom.com/share/b4ed7ebf13304ec5a57a1135b71aea4b?sid=19952a16-478c-4c59-8876-068cfe3bbc1f

## Live Link:
https://nicole-to-do-list.vercel.app/Signup

## Overview

ToDoList is a React-based application designed to help users manage their tasks effectively. It allows users to add, delete, and mark tasks as complete, and it also supports the management of subtasks, providing a hierarchical structure for task management. The application is integrated with Firebase for backend, allowing real-time data synchronization and authentication.

## Features

- **Task Management**: Add, delete, and mark tasks as complete.
- **Subtasks**: Manage subtasks for each main task.
- **User Authentication**: Sign up and log in functionality.
- **Real-Time Data**: Firebase real-time database integration.
- **Drag and Drop**: Reorder tasks based on priority.

## Project Structure

### Frontend

- **[`src/App.js`](https://github.com/nicolebdantas/ToDoList/blob/main/src/App.js)**: Main component that wraps the entire application. It includes routing to different pages such as Home, Signup, and Login.
  
- **Components**
  - **Todo.js**: This file contains the Todo component, responsible for rendering individual todo items.
  - **TodoForm.js**: This file contains the TodoForm component, which handles the creation and updating of tasks.
  - **TodoList.js**: This file contains the TodoList component, responsible for rendering the list of tasks.
  - **SubTaskList.js**: This file contains the SubTask component, which handles the rendering of subtasks.
  - **SubTaskForm.js**: This file contains the SubTaskForm component, which handles the creation of subtasks.
  - **catLoader.js**: This file contains the API for cat images utilized in the TodoList.
  - **imageFetcher.js**: This file contains a cat animation for loading.

- **Pages**
  - **Home**: Main page where tasks are displayed and managed.
  - **KanbanBoard**: Main content of the homepage with all the columns.
  - **Signup**: Page for user registration.
  - **Login**: Page for user login.

### Backend

- **[`src/firebase.js`](https://github.com/nicolebdantas/ToDoList/blob/main/src/firebase.js)**: Configuration and initialization of Firebase. It includes the setup for authentication and the Firestore database.

### Authentication

- **Signup and Login**: Functionalities are integrated using Firebase authentication services.

### Styling

- CSS is used for styling the components, ensuring a user-friendly interface.

## Running the Application

1. Navigate to the project directory and install dependencies using `npm install`.
2. Automatically force package updates (this is necessary because of the use of a few outdated libraries) using `npm audit fix --force`.
3. Run the application using `npm start`.