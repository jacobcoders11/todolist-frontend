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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} userType="user" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">My Todos</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your tasks and stay organized</p>
        </div>

        {/* Todo Card Container */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Input Section - Add New Todo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex gap-3">
              <input
                id="todoInput"
                type="text"
                placeholder="Add a new todo..."
                className="flex-1 input input-bordered bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddClick(e.target);
                  }
                }}
              />
              <button
                onClick={() => handleAddClick(document.getElementById('todoInput'))}
                className="btn bg-gradient-to-r from-slate-700 to-blue-900 hover:from-slate-800 hover:to-blue-950 text-white border-0 px-8"
              >
                <i className="bi bi-plus-lg mr-1"></i>
                Add
              </button>
            </div>
          </div>

          {/* Todos List Section */}
          <div className="divide-y divide-gray-100">
            {/* Empty State - Show when no todos */}
            {todos.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-clipboard-check text-2xl text-gray-400"></i>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No todos yet</p>
                <p className="text-xs text-gray-500">Add your first todo above to get started</p>
              </div>
            ) : (
              /* Todo Items */
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 hover:bg-gray-50/50 transition-all flex items-center gap-3 group"
                >
                  {/* Complete/Incomplete Button */}
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className="shrink-0"
                    title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {todo.completed ? (
                      <div className="w-5 h-5 bg-green-700 rounded-full flex items-center justify-center shadow-sm">
                        <i className="bi bi-check text-base text-white font-bold"></i>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-slate-700 transition-colors"></div>
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
                        className="flex-1 input input-sm input-bordered border-slate-700 focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="btn btn-sm bg-slate-700 hover:bg-slate-800 text-white border-0"
                        title="Save"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn btn-sm btn-ghost"
                        title="Cancel"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  ) : (
                    /* View Mode - Show text */
                    <p
                      className={`flex-1 text-sm ${
                        todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {todo.title}
                    </p>
                  )}

                  {/* Action Buttons - Only show in view mode */}
                  {editingId !== todo.id && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(todo)}
                        className="btn btn-sm btn-ghost text-slate-700 hover:bg-slate-100"
                        title="Edit todo"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                        title="Delete todo"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Stats - Show todo counts */}
          {todos.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex gap-4 text-sm">
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{activeTodos}</span> active
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{completedTodos}</span> completed
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}