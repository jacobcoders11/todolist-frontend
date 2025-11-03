# todolist-frontend
This is the frontend of a simple MERN To-Do List Application, built using Next.js 14, React, and Tailwind CSS.
It allows users to add, mark, and delete tasks, and connects to a backend API built with Express.js and MongoDB.

# Project Description
This project is a minimal to-do list web app designed to demonstrate a full-stack MERN workflow.
The frontend (this repository) provides the user interface built with Next.js and styled with Tailwind CSS.
It communicates with a REST API from the backend server to perform CRUD (Create, Read, Update, Delete) operations on tasks.

# Tech Stack
Next.js 14 (React framework)
Tailwind CSS 4 for UI styling
Axios for API requests
React Icons for simple icons
Node.js + Express.js + MongoDB on the backend (separate repository)

# Core Features
Dashboard Overview – displays Total Todos, Completed, and Pending counts.
My Todos – view and manage all to-do items.
Completed Tasks – see all finished tasks.
Profile Page – show user info.
User Session Panel – user details and Sign Out button in sidebar.
Fully responsive UI built with Tailwind CSS.

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

## Tips

- Write clear, descriptive commit messages
- Commit frequently with small, logical changes
- Always pull before pushing to avoid conflicts
- Use `git status` frequently to see what's happening
