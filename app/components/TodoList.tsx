'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

interface Todo {
    id: number;
    task: string;
    completed: boolean;
}

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTask, setNewTask] = useState<string>('');
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        fetchTodos();
    },[])

    const fetchTodos = async () => {
        setIsLoading(true);
        try{
        const response = await fetch('/api/todos');
        const data = await response.json();
        setTodos(data);
        } catch(error){
            console.error('Error fetching todos', error);
            toast.error('Failed to fetch todos');
        } finally {
            setIsLoading(false);
        }
    }

    const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTask.trim() || isAdding) return; 
        setIsAdding(true);
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({task: newTask}),
            });
            const data = await response.json();
            setTodos([data, ...todos]);
            setNewTask('');
            toast.success('Todo added successfully');
        } catch(error) {
            toast.error('Failed to add todo');
        } finally {
            setIsAdding(false);
        }
    }

    const toggleComplete = async (id: number, completed: boolean) => {
        if (loadingTodos.includes(id)) return;
        setLoadingTodos(prev => [...prev, id]);
        // Update the state locally first
        setTodos(prevTodos => prevTodos.map(todo => 
            todo.id === id ? { ...todo, completed: !completed } : todo
        ));
        try {
            await fetch('/api/todos', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, completed: !completed}),
            });
            toast.success('Todo updated successfully');
        } catch(error) {
            // Revert the change if the API call fails
            setTodos(prevTodos => prevTodos.map(todo => 
                todo.id === id ? { ...todo, completed: completed } : todo
            ));
            toast.error('Failed to update todo');
        } finally {
            setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
        }
    }

    const deleteTodo = async (id: number) => {
        if (loadingTodos.includes(id)) return;
        setLoadingTodos(prev => [...prev, id]);
        // Remove the todo from the state locally first
        const removedTodo = todos.find(todo => todo.id === id);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        try {
            await fetch('/api/todos', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id}),
            });
            toast.success('Todo deleted successfully');
        } catch(error) {
            // Add the todo back if the API call fails
            if (removedTodo) {
                setTodos(prevTodos => [...prevTodos, removedTodo]);
            }
            toast.error('Failed to delete todo');
        } finally {
            setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
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
          disabled={isAdding}
        />
        <button 
          type="submit" 
          className="p-2 bg-blue-500 text-white rounded-r disabled:bg-blue-300"
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader color="#3B82F6" size={50} />
        </div>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between p-2 border-b">
              <span className={todo.completed ? 'line-through' : ''}>{todo.task}</span>
              <div>
                <button
                  onClick={() => toggleComplete(todo.id, todo.completed)}
                  className="mr-2 p-1 bg-green-500 text-white rounded disabled:bg-green-300"
                  disabled={loadingTodos.includes(todo.id)}
                >
                  {loadingTodos.includes(todo.id) ? 'Updating...' : (todo.completed ? 'Undo' : 'Complete')}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1 bg-red-500 text-white rounded disabled:bg-red-300"
                  disabled={loadingTodos.includes(todo.id)}
                >
                  {loadingTodos.includes(todo.id) ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TodoList