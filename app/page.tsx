'use client';

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // Fetch todos on page load
  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  // Create a new todo
  function createTodo() {
    const content = window.prompt("Enter new todo content");
    if (content) {
      client.models.Todo.create({
        content,
      });
    }
  }

  // Delete a todo by id
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-violet-500 text-white py-20 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Nirdeshona</h1>
        <p className="text-lg mb-6 max-w-3xl mx-auto">
          Empowering learners and educators with innovative tools and solutions. Unlock the power of technology for lifelong learning.
        </p>
        <button
          onClick={createTodo}
          className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
        >
          Get Started
        </button>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-10">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="service-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">Web Development</h3>
            <p>
              We create modern, responsive websites that scale seamlessly to meet your business needs.
            </p>
          </div>
          <div className="service-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">Mobile App Development</h3>
            <p>
              Offering cutting-edge mobile app solutions for both Android and iOS with performance and design in mind.
            </p>
          </div>
          <div className="service-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">Digital Marketing</h3>
            <p>
              Boost your brand’s digital presence through SEO, social media marketing, and data-driven strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="feature-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">Innovative Solutions</h3>
            <p>
              We are constantly exploring new ways to solve problems with technology, ensuring you stay ahead of the curve.
            </p>
          </div>
          <div className="feature-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">Customer-Centric Approach</h3>
            <p>
              Our solutions are designed with your needs in mind. We prioritize your success in everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-500 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to Get Started?</h2>
        <p className="mb-8 max-w-3xl mx-auto">
          Whether you’re a student, educator, or business looking for innovative solutions, we’re here to help you achieve your goals.
        </p>
        <button
          onClick={createTodo}
          className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
        >
          Contact Us
        </button>
      </section>

      {/* Todo List Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-6">My Todos</h2>
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                onClick={() => deleteTodo(todo.id)}
                className="p-4 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition mb-4"
              >
                {todo.content}
              </li>
            ))}
          </ul>
          <button
            onClick={createTodo}
            className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold hover:bg-blue-600 transition"
          >
            Add New Todo
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2025 Nirdeshona. All rights reserved.</p>
        <p>Built with passion and dedication to transforming education.</p>
      </footer>
    </div>
  );
}
