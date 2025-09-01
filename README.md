Cannabis Store 🛒

A modern, full-featured web application for managing a cannabis product store. Built with HTML, CSS, JavaScript, Node.js, and Supabase, this project demonstrates e-commerce functionality including product management, shopping cart, and checkout systems.

Currently in the initial development phase, with the admin dashboard and cart functionality working. Future phases will include a chatbot, an authentication system, and advanced features.

Table of Contents

Project Overview

Features

Tech Stack

Installation

Usage

Future Plans

Contributing

License

Project Overview

Cannabis Store allows users to browse cannabis products, add them to a shopping cart, and checkout with quantities stored in Supabase. The admin dashboard allows easy management of products (add, edit, delete).

The project is structured for scalability and future integration of Node.js backend, API routes, authentication, and AI chatbot support.

Features

✅ Product catalogue with name, category, price, stock, and image
✅ Shopping cart with add, remove, increase/decrease quantity
✅ Checkout system integrated with Supabase
✅ Admin dashboard to manage products
✅ Responsive HTML/CSS front-end
✅ Modular JavaScript code for maintainability

Planned Features:

User authentication (signup/login)

Chatbot support for store assistance

Search, filter, and category navigation

Node.js backend with APIs for products and orders

Order history and user profiles

Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: Supabase

Version Control: Git & GitHub

Installation

Clone the repository:

git clone https://github.com/<your-username>/cannabis-store.git
cd cannabis-store


Install dependencies:

npm install


Create a .env file for Supabase keys:

SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key


Run the Node.js server:

node server.js


Open your browser at http://localhost:3000

Usage

Visit /index.html to view products and add to cart.

Visit /cart.html to manage your shopping cart and checkout.

Visit /admin.html to manage products as an admin.

Future Plans

Integrate a chatbot for customer support

Add user accounts with login/signup

Expand product filtering and search features

Implement a payment gateway for real purchases

Deploy to Vercel or Heroku for live access

Contributing

Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'Add feature')

Push to the branch (git push origin feature/your-feature)

Open a Pull Request

License

This project is licensed under the MIT License – see the LICENSE
 file for details.
