# todolist-frontend

Basic Git Workflow
1. Check Status
git status


Shows the current state of your working directory and staging area.

2. Add Changes
git add .


Stages all changes in the current directory for commit.

Alternative:

git add filename.txt


Stages a specific file.

3. Commit Changes
git commit -m "Your commit message"


Commits staged changes with a descriptive message.

4. Push Changes
git push


Uploads your local commits to the remote repository.

First time pushing a new branch:

git push -u origin branch-name

Working with Branches
5. Switch Branches
git checkout branch-name


Switches to an existing branch.

Create and switch to a new branch:

git checkout -b new-branch-name

6. Fetch Updates
git fetch


Downloads updates from the remote repository without merging them.

7. Pull Updates
git pull


Downloads and merges updates from the remote repository into your current branch.

⚙️ Common Workflow Example

Make changes to your files

Stage all changes:

git add .


Commit with a clear message:

git commit -m "Description of changes"


Push to remote:

git push

Before Starting Work

Always pull the latest changes before making new edits:

git pull

Tips

Write clear and descriptive commit messages.

Commit frequently with small, logical changes.

Always pull before pushing to avoid conflicts.

Use git status often to monitor your repository’s state.
