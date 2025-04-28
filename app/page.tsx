"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">My todos</h1>
      <button
        onClick={createTodo}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + New Todo
      </button>
      <ul className="mt-4 w-full max-w-md p-4 border border-gray-300 rounded">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-white p-2 rounded mb-2 hover:bg-gray-200"
          >
            {todo.content}
          </li>
        ))}
      </ul>
    </main>
  );
}
