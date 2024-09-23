import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ToDoList.css';

export default function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState(''); // إضافة حالة جديدة للوصف
  const [error, setError] = useState('');

  // Assuming the token is stored in localStorage
  const token = localStorage.getItem('token');

  // Fetch all tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks`, {
        headers: {
          token: token,
        },
      });
      setTasks(response.data);
    } catch (error) {
      setError('Failed to fetch tasks');
    }
  };

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask) {
      setError('Task cannot be empty');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/tasks',
        { name: newTask, description }, // إرسال الوصف الموجود في الحالة
        {
          headers: {
            token: token,
          },
        }
      );
      setNewTask('');
      setDescription(''); // إعادة تعيين الوصف بعد الإضافة
      fetchTasks(); // Refresh tasks after adding
    } catch (error) {
      setError('Failed to add task');
    }
  };

  // Delete a task by ID
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          token: token,
        },
      });
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-header">To-Do List</h1>
      
      <form className="todo-form" onSubmit={addTask}>
        <input
          className="todo-input"
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          className="todo-input"
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // تحديث الوصف
        />
        <button className="todo-button" type="submit">Add Task</button>
      </form>
      
      {error && <p className="todo-error">{error}</p>}

      <ul className="todo-list">
        {tasks.map(task => (
          <li className="todo-item" key={task._id}>
            {task.name} {/* استخدام name بدلاً من task */}
            <button className="todo-delete" onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
