"use client";

import { useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  return (
    <div>
      {/* Header Section */}
      <header>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Body Section */}
      <main>
        <h1>Welcome to My App</h1>
        <p>This is a simple app structure with header, body, and footer sections.</p>
        
        {/* You can add content here as needed */}
        <div>
          🥳 App successfully hosted.
          <br />
          <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
            Review next steps of this tutorial.
          </a>
        </div>
      </main>

      {/* Footer Section */}
      <footer>
        <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
        <p>
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
        </p>
      </footer>

      {/* CSS for basic styling */}
      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        header {
          background-color: #333;
          color: white;
          padding: 10px;
        }
        header nav ul {
          list-style: none;
          padding: 0;
        }
        header nav ul li {
          display: inline;
          margin-right: 20px;
        }
        header nav ul li a {
          color: white;
          text-decoration: none;
        }
        main {
          padding: 20px;
        }
        footer {
          background-color: #333;
          color: white;
          padding: 10px;
          text-align: center;
        }
        footer a {
          color: white;
          text-decoration: none;
        }
        footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
