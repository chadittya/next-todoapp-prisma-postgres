'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

interface Todo {
    id: number;
    task: string;
    completed: boolean;
}

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTask, setNewTask] = useState<string>('');

    useEffect(()=>{
        fetchTodos();
    },[])

    const fetchTodos = async () => {
        const response = await fetch('/api/todos');
        const data = await response.json();
        setTodos(data);
    }

    const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTask.trim()) return; //if the task is empty, return
        try{
        const response = await fetch('/api/todos', {
            method: 'POST', //POST request to create a new todo
            headers: {'Content-Type': 'application/json'}, //set the content type to JSON
            body: JSON.stringify({task: newTask}), //stringify the new task
        })
        const data = await response.json(); //parse the response as JSON
        setTodos([data, ...todos]); //update the state with the new todo
        setNewTask(''); //clear the input field
        toast.success('Todo added successfully');
        }catch(error){
            toast.error('Failed to add todo');
        }
    }

    const toggleComplete = async (id:number, completed:boolean) =>{
        try{
        await fetch('/api/todos', {
            method: 'PUT', //PUT request to update a todo
            headers: {'Content-Type': 'application/json'}, //set the content type to JSON
            body: JSON.stringify({id, completed:!completed}),//stringify the id and completed status
        })
        fetchTodos(); //fetch the updated todos
        toast.success('Todo completed successfully');
        }catch(error){
            toast.error('Failed to complete todo');
        }
    }

    const deleteTodo = async (id:number) => {
        try{
        await fetch('/api/todos', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id}),
        })
        fetchTodos();
        toast.success('Todo deleted successfully');
        }catch(error){
            toast.error('Failed to delete todo');
        }
    }

  return (
    <div className="max-w-md mx-auto mt-10">
    <Toaster position='top-right'/>
      <form onSubmit={addTodo} className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow p-2 border rounded-l text-black"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
          Add Task
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-2 border-b">
            <span className={todo.completed ? 'line-through' : ''}>{todo.task}</span>
            <div>
              <button
                onClick={() => toggleComplete(todo.id, todo.completed)}
                className="mr-2 p-1 bg-green-500 text-white rounded"
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList