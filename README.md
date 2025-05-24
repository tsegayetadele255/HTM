# Vascular Equipment II CMMS

A modern Computerised Maintenance Management System (CMMS) for vascular medical equipment , built with Next.js (frontend) and Express.js (backend) and mySQL Database.

## Features
- Real-time dashboard with summary cards and interactive pie chart for equipment status
- Equipment, Work Orders, Spare Parts, Users, Incident Reporting, SOPs, Training, Calibration, Audit Logs, Disposal & Decommissioning, Budget & Procurement modules
- Modern, responsive, and user-friendly UI
- Data visualization using Chart.js
- Robust backend API with Express.js and TypeORM
- API proxying for seamless frontend-backend integration

## Tech Stack
- **Frontend:** Next.js, React, Axios, Chart.js (react-chartjs-2)
- **Backend:** Express.js, TypeORM, MySQL (or compatible DB)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MySQL or compatible database

### Setup

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd HTM
```

#### 2. Install Dependencies
- **Frontend:**
  ```bash
  cd frontend
  npm install
  ```
- **Backend:**
  ```bash
  cd ../backend
  npm install
  ```

#### 3. Configure Environment
- **Backend:**
  - Copy `.env.example` to `.env` and update DB credentials and other settings.
- **Frontend:**
  - Update API proxy settings in `next.config.js` if necessary.

#### 4. Database Setup
- Run migrations or import schema as needed for your database.

#### 5. Run the App
- **Backend:**
  ```bash
  npm run dev
  ```
- **Frontend:**
  ```bash
  cd ../frontend
  npm run dev
  ```
- Access the app at [http://localhost:3000](http://localhost:3000)

## Project Structure
```
HTM/
├── backend/      # Express.js API server
├── frontend/     # Next.js frontend app
└── README.md
```

## Customization
- To add or change equipment status mappings, edit `frontend/src/app/dashboard/page.tsx`.
- To update branding, modify `frontend/src/app/layout.tsx` and logo assets.



For questions or support, please contact tsegayetadele92@gmail.com the project maintainer.
