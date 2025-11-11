"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";

export default function MyTodos() {
  // State to store all todos
  const [todos, setTodos] = useState([]);

  // State for sidebar active tab
  const [activeTab] = useState('my-todos');

  // State to track which todo is being edited (stores the todo id)
  const [editingId, setEditingId] = useState(null);

  // State to store the edited text temporarily
  const [editText, setEditText] = useState('');

  // Load todos when page first loads
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to get all todos from backend
  async function fetchTodos() {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/todos", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && Array.isArray(data.todos)) {
        setTodos(data.todos);
      } else {
        console.error("API response:", data);
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  }

  // Function to add a new todo
  async function addTodo(title) {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          todo: { title, completed: false }
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add new todo to the top of the list
        setTodos([data.todo, ...todos]);
      } else {
        console.error("Error adding todo:", data.error);
        alert(data.error || "Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo");
    }
  }

  // Function to mark todo as complete or incomplete
  async function toggleTodo(id, currentStatus) {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });

      // Update the todo in the list
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !currentStatus } : todo
      ));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  // Function to delete a todo
  async function deleteTodo(id) {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      await fetch(`/api/todos/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // Remove the todo from the list
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  // Function to start editing a todo
  function startEdit(todo) {
    setEditingId(todo.id);
    setEditText(todo.title);
  }

  // Function to cancel editing
  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  // Function to save edited todo
  async function saveEdit(id) {
    const trimmedText = editText.trim();

    if (!trimmedText) {
      cancelEdit();
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: trimmedText })
      });

      // Update the todo in the list
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, title: trimmedText } : todo
      ));

      // Exit edit mode
      cancelEdit();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  }

  // Helper function to handle add button click
  function handleAddClick(inputElement) {
    const value = inputElement.value.trim();
    if (value) {
      addTodo(value);
      inputElement.value = '';
    }
  }

  // Count active and completed todos (with safety check)
  const activeTodos = todos.filter(t => t && !t.completed).length;
  const completedTodos = todos.filter(t => t && t.completed).length;


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} userType="user" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Todos</h1>

        {/* Todo Card Container */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">

          {/* Input Section - Add New Todo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-3">
              <input
                id="todoInput"
                type="text"
                placeholder="Add a new todo..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddClick(e.target);
                  }
                }}
              />
              <button
                onClick={() => handleAddClick(document.getElementById('todoInput'))}
                className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Todos List Section */}
          <div className="divide-y divide-gray-200">
            {/* Empty State - Show when no todos */}
            {todos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="bi bi-clipboard-check text-4xl mb-2"></i>
                <p>No todos yet. Add one above!</p>
              </div>
            ) : (
              /* Todo Items */
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  {/* Complete/Incomplete Button */}
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className="shrink-0"
                    title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {todo.completed ? (
                      <i className="bi bi-check-circle-fill text-2xl text-green-500"></i>
                    ) : (
                      <i className="bi bi-circle text-2xl text-gray-300 hover:text-gray-400"></i>
                    )}
                  </button>

                  {/* Todo Title or Edit Input */}
                  {editingId === todo.id ? (
                    /* Edit Mode - Show input field */
                    <div className="flex-1 flex gap-2 items-center">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(todo.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 px-3 py-1.5 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="shrink-0 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                        title="Save"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="shrink-0 px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm font-medium"
                        title="Cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    /* View Mode - Show text */
                    <p
                      className={`flex-1 text-base ${todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                        }`}
                    >
                      {todo.title}
                    </p>
                  )}

                  {/* Action Buttons - Only show in view mode */}
                  {editingId !== todo.id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(todo)}
                        className="shrink-0 p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit todo"
                      >
                        <i className="bi bi-pencil text-lg"></i>
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete todo"
                      >
                        <i className="bi bi-trash text-lg"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Stats - Show todo counts */}
          {todos.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 flex justify-between">
              <span>{activeTodos} active</span>
              <span>{completedTodos} completed</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}