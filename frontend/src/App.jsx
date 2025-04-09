import { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = { title, description };
    axios.post('http://localhost:5000/tasks', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setTitle('');
        setDescription('');
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();
    const updatedTask = {
      title: editTitle,
      description: editDescription,
      completed: tasks.find(task => task.id === id).completed
    };
    axios.put(`http://localhost:5000/tasks/${id}`, updatedTask)
      .then(response => {
        setTasks(tasks.map(task =>
          task.id === id ? response.data : task
        ));
        setEditingTaskId(null);
        setEditTitle('');
        setEditDescription('');
      })
      .catch(error => console.error('Error updating task:', error));
  };

  return (
    <div>
      <h1>Task Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, task.id)}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit title"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Edit description"
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingTaskId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {task.title} - {task.description} - {task.completed ? 'Done' : 'Pending'}
                <button onClick={() => handleDelete(task.id)}>Delete</button>
                <button onClick={() => {
                  setEditingTaskId(task.id);
                  setEditTitle(task.title);
                  setEditDescription(task.description);
                }}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;