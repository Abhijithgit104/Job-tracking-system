# Job Tracking System

A full-stack **Job Board and Application Tracking Platform** where **Employers** can post and manage jobs, and **Candidates** can browse, apply, and track application status.

## Live Demo

**Frontend:**  
https://job-tracking-system-2-ncuc.onrender.com

**Backend API:**  
https://job-tracking-system-1-c57w.onrender.com/api/

---

## Features

### Authentication
- User registration and login using JWT authentication
- Role-based access control
- Two user roles:
  - **Employer**
  - **Candidate**

---

### Employer Features
- Create job listings
- Edit and update job postings
- Close job openings
- View all posted jobs
- View received applications
- Update candidate application status:
  - Applied
  - Shortlisted
  - Rejected

---

### Candidate Features
- Register and login
- Browse available jobs
- Search and filter jobs by:
  - Role
  - Location
  - Salary
- Apply for jobs
- Track application status
- Manage profile
- Upload resume

---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Django
- Django REST Framework
- Simple JWT Authentication
- PostgreSQL
- CORS Headers

### Deployment
- Render (Frontend)
- Render (Backend)
- PostgreSQL Database

---

## Project Structure

```bash
job-tracking-system/
│
├── backend/
│   ├── users/
│   ├── jobs/
│   ├── jobtracker/
│   └── manage.py
│
└── frontend/
    ├── src/
    └── package.json
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register user |
| POST | `/api/login/` | Login and get JWT token |

---

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | List all jobs |
| POST | `/api/jobs/` | Create new job |
| GET | `/api/jobs/<id>/` | Job details |
| PUT | `/api/jobs/<id>/` | Update job |

---

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/applications/` | View applications |
| POST | `/api/jobs/applications/` | Apply for job |
| PATCH | `/api/jobs/applications/<id>/status/` | Update application status |

---

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/` | Get profile |
| PATCH | `/api/profile/` | Update profile |

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/your-username/job-tracking-system.git
cd job-tracking-system
```

---

## Backend Setup

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```bash
venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Configure Environment Variables

Create `.env` file:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=your-database-url
```

---

### Run Migrations

```bash
python manage.py migrate
```

---

### Start Backend Server

```bash
python manage.py runserver
```

Backend runs at:

```bash
http://127.0.0.1:8000
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

## Deployment

### Backend on Render
- Connect GitHub repository
- Build command:

```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

- Start command:

```bash
gunicorn jobtracker.wsgi:application
```

---

### Frontend on Render
- Build command:

```bash
npm install && npm run build
```

- Publish directory:

```bash
dist
```

---

## Future Improvements
- Email notifications
- Resume parsing
- Employer analytics dashboard
- Saved jobs feature
- Interview scheduling
- Candidate recommendations

---

## Author

**Abhijith**

GitHub: https://github.com/Abhijithgit104
