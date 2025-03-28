import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() =>{
    axios.get('http://localhost:5000/tasks')
    .then(response => setTasks(response.data))
    .catch(error => console.error('error fetching task: ' + error));
  },[])

const handleSubmit = (e) =>{
  e.preventDefault();
  const newTask = {title, description}
  axios.post('http://localhost:5000/tasks', newTask)
  .then(response => setTasks(response.data))
  .catch(error => console.error('error creating task: ' + error));
}
const handleDeleteTask = (id) =>{
  axios.delete(`http://localhost:5000/tasks/${id}`)
  .then(() => {
    setTasks(tasks.filter(task => task.id !== id));
  })
  .catch(error => console.error('error deleting task: ' + error));
}

const handleUpdateTask = (id) =>{
  const tasktoUpdate = tasks.filter(task => task.id === id);
  const updatedTask = {title, description, completed:!tasktoUpdate.completed}
  axios.put(`http://localhost:5000/tasks/${id}`, updatedTask)
  .then(response => {
    setTasks(tasks.map(task =>
      task.id === id ? response.data : task
    ))
  })
  .catch (error => console.error('error toggling task :' + error.message))
}

  return (
    <div>
      <h1>Task Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" 
        value = {title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='title'
        requited
        />
        <input type="text" 
        value = {description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='description'
        requied
        />
        <button type='submit'>Add Task</button>
        </form>
      <ul>
        {tasks.map(task =>(
          <li key = {task.id}>
              {task.title} - {task.description} - {task.completed ? 'done ': 'pending '}
              <button onClick = {() => handleDeleteTask(task.id)}> delete </button>
              <button onClick = {() => handleUpdateTask(task.id)}> toggle </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
