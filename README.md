# Student Productivity Hub

**Name:** Umar Razaq  
**Roll No:** F24BDOCS1M01326

**Project Title:** Student Productivity Hub - Task, Habit & Progress Dashboard

## How to Run

### Step 1 — Install Node.js

If Node.js is not installed, download and install it from:

https://nodejs.org

### Step 2 — Open Project Folder

Open a terminal and navigate to the project folder:

```bash
cd path/to/project-folder
```

### Step 3 — Start JSON Server

If JSON Server is installed globally:

```bash
json-server --watch db.json
```

Or if you're using the newer version:

```bash
npx json-server db.json
```

The backend server will start on:

```text
http://localhost:3000
```

### Step 4 — Open the Application

Open the following files in your browser:

- index.html (User Panel)
- admin.html (Admin Panel)

You may also use the VS Code Live Server extension.

## API Endpoints

### Tasks

```text
http://localhost:3000/tasks
```

### Habits

```text
http://localhost:3000/habits
```

## Notes

- Keep JSON Server running while using the application.
- Do not close the terminal running JSON Server.
- All project data is stored in db.json.
- If data is not loading, verify that JSON Server is running on port 3000.
