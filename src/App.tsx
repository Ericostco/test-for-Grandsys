import React, { useState, useEffect } from "react";
import "./App.css";

// 待辦事項類型定義
interface TodoItem {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
}

// 篩選類型
type FilterType = "all" | "completed" | "incomplete";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos
      ? JSON.parse(savedTodos).map((todo: TodoItem) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }))
      : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          title: newTodo.trim(),
          isCompleted: false,
          createdAt: new Date(),
        },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: editText.trim() } : todo
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isCompleted;
    if (filter === "incomplete") return !todo.isCompleted;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>Todo List</h1>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新增待辦事項..."
          className="todo-input"
        />
        <button type="submit" className="add-button">
          新增
        </button>
      </form>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          全部
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          已完成
        </button>
        <button
          className={filter === "incomplete" ? "active" : ""}
          onClick={() => setFilter("incomplete")}
        >
          未完成
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.isCompleted ? "completed" : ""}`}
          >
            {editingId === todo.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                />
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="save-button"
                >
                  儲存
                </button>
              </div>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-title">{todo.title}</span>
                <div className="todo-actions">
                  <button
                    onClick={() => startEditing(todo)}
                    className="edit-button"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                  >
                    刪除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
