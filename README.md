# todolist-frontend

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
