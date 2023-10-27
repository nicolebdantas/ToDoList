import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Draggable } from 'react-beautiful-dnd';


const Todo = ({ todos, subtodos, completeTodo, removeTodo, updateTodo }) => {

  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  const submitUpdate = value => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: ''
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return todos.map((todo, index) => (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (

    <div
      className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
      key={index}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      isdragging={snapshot.isDragging.toString()}
    >
      <div key={todo.id} onClick={() => completeTodo(todo.id)}>
        {todo.text}
      </div>
      <div className='icons'>
        <div className='subTaskNumber'>
          {todo.subtasks.length > 0 ? todo.subtasks.length : ""}  
        </div>
        <FontAwesomeIcon
        icon={faTrash}
        onClick={() => removeTodo(todo.id)}
        className='delete-icon'
        />

        <FontAwesomeIcon
        icon={faEdit}
        onClick={() => setEdit({ id: todo.id, value: todo.text })}
        className='edit-icon'
        />
        
      </div>
    </div>
      )}
    </Draggable>
  ));
};

export default Todo;