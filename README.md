# TodoList Frontend

A modern, full-featured Todo List application frontend built with Next.js 16, React 19, and Tailwind CSS 4. This application provides a beautiful, responsive user interface with separate dashboards for administrators and regular users, featuring real-time todo management, user authentication, and profile management.

## Project Description

This is the frontend component of a full-stack Todo List application that demonstrates modern web development practices. The application features a clean, minimal design inspired by Atlassian's design language, with a dark blue color theme and rounded components.

The frontend communicates with a REST API backend (separate repository) to perform CRUD operations on todos and user management. It includes role-based access control with separate interfaces for administrators and regular users.

## Tech Stack

- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework with @theme and @plugin directives
- **DaisyUI 5.5.0** - Component library for Tailwind CSS
- **date-fns** - Modern JavaScript date utility library
- **Bootstrap Icons** - Icon library
- **React Icons** - Additional icon components

## Core Features

### User Features
- **Authentication** - Secure login and registration with JWT tokens
- **Dashboard** - Overview with Total Todos, Completed, and Pending counts in modern rectangular cards
- **My Todos** - Create, read, update, and delete todos with inline editing
- **Profile Management** - View and edit user profile information
- **Change Password** - Secure password update functionality
- **Responsive Design** - Fully responsive UI optimized for desktop and mobile

### Admin Features
- **Admin Dashboard** - System-wide statistics and quick actions
- **User Management** - View and delete users (except own account)
- **Todo Management** - View all todos across all users with filtering (All, Completed, Pending)
- **Role-Based Access** - Separate navigation and features for admin users

### Design Features
- **Dark Blue Theme** - Modern color scheme with slate-700 to blue-900 gradients
- **Minimal Rounded Design** - Atlassian-inspired UI with rounded-2xl components
- **Circular Checkboxes** - Dark green (green-700) checkboxes for completed todos
- **Backdrop Blur Modals** - Modern modal dialogs with blur effects
- **Smooth Transitions** - Hover states and animations throughout the app

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Backend API** running (see todolist-backend repository)

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/jacobcoders11/todolist-frontend.git
cd todolist-frontend
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

This will install all required dependencies including:
- Next.js and React
- Tailwind CSS and DaisyUI
- date-fns for date formatting
- Icon libraries (Bootstrap Icons, React Icons)

### 4. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory (if not already present):

```bash
touch .env.local
```

Add the following environment variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# You can add other environment variables here as needed
```

**Note:** The application uses `/api` proxy routes configured in `next.config.js` to communicate with the backend API.

### 5. Verify Backend Connection

Ensure your backend API is running on `http://localhost:5000` (or update the proxy configuration in `next.config.js` if using a different port).

The backend should have the following endpoints available:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /todos` - Get user todos
- `POST /todos` - Create todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `PUT /users/change-password` - Change password
- `GET /admin/stats` - Get admin statistics
- `GET /admin/users` - Get all users
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/todos` - Get all todos
- `DELETE /admin/todos/:id` - Delete todo

### 6. Run the Development Server

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the login page. Register a new account or use existing credentials to log in.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router directory
│   ├── globals.css              # Global styles and Tailwind configuration
│   ├── layout.js                # Root layout component
│   ├── page.js                  # Login page
│   ├── registration/            # Registration page
│   ├── user/                    # User pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── todos/              # Todo management
│   │   ├── profile/            # User profile
│   │   └── change-password/    # Password change
│   └── admin/                   # Admin pages
│       ├── dashboard/          # Admin dashboard
│       ├── users/              # User management
│       └── todos/              # All todos management
├── components/                  # Reusable components
│   └── Sidebar.js              # Navigation sidebar
├── public/                      # Static assets
├── next.config.js              # Next.js configuration with API proxy
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── jsconfig.json               # JavaScript configuration
└── package.json                # Dependencies and scripts
```

## Available Scripts

In the `frontend` directory, you can run:

### `npm run dev`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `.next` folder

### `npm start`
Runs the built app in production mode

### `npm run lint`
Runs ESLint to check for code quality issues

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The application will be optimized for production with:
- Minified JavaScript and CSS
- Optimized images
- Static generation where possible

## Configuration Notes

### Tailwind CSS Configuration

The project uses Tailwind CSS 4 with the new `@theme` directive in `globals.css`:

```css
@plugin "daisyui";

@theme {
  --color-primary-dark-blue: #334155;
  --color-primary-blue: #1e3a8a;
}
```

Custom colors are defined for the dark blue theme.

### API Proxy Configuration

The `next.config.js` file includes a proxy configuration that forwards API requests from your frontend to the backend server. Here's how it works:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:5000/api/:path*'
    }
  ];
}
```

## User Roles

The application supports two user roles:

### Regular User (role: 2)
- Access to personal dashboard
- Manage own todos
- Edit profile and change password

### Admin User (role: 1)
- Access to admin dashboard with system statistics
- Manage all users (except own account)
- View and manage all todos across all users
- Filter todos by status (All, Completed, Pending)

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Delete `.next` folder and `node_modules`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall dependencies: `npm install`
4. Rebuild: `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Related Repositories

- **Backend Repository**: [todolist-backend](https://github.com/jacobcoders11/todolist-backend)

## License

This project is for educational purposes.

## Git Basics Guide

A simple guide to the most commonly used Git commands.

## Basic Git Workflow

### 1. Check Status
```bash
git status
```
Shows the current state of your working directory and staging area.

### 2. Add Changes
```bash
git add .
```
Stages all changes in the current directory for commit.

**Alternative:**
```bash
git add filename.txt
```
Stages a specific file.

### 3. Commit Changes
```bash
git commit -m "Your commit message"
```
Commits staged changes with a descriptive message.

### 4. Push Changes
```bash
git push
```
Uploads your local commits to the remote repository.

**First time pushing a new branch:**
```bash
git push -u origin branch-name
```

## Working with Branches

### 5. Switch Branches
```bash
git checkout branch-name
```
Switches to an existing branch.

**Create and switch to new branch:**
```bash
git checkout -b new-branch-name
```

### 6. Fetch Updates
```bash
git fetch
```
Downloads updates from remote repository without merging them.

### 7. Pull Updates
```bash
git pull
```
Downloads and merges updates from remote repository to your current branch.

## Common Workflow Example

1. Make changes to your files
2. `git add .` - Stage all changes
3. `git commit -m "Description of changes"` - Commit changes
4. `git push` - Push to remote repository

## Before Starting Work

```bash
git pull
```

Always pull the latest changes before starting new work.
