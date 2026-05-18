# 🛠️ TechFix Pro: From Sticky Notes to Digital Efficiency

### **Project Overview**

**TechFix Pro** is a professional full-stack application designed for a fictional small business to modernize their internal technical support workflow. Previously, the company relied on physical sticky notes to track hardware and software issues, leading to lost tickets and poor accountability.

This digital transformation provides a centralized dashboard with **Role-Based Access Control (RBAC)**, real-time ticket tracking, and secure user management.

---

### **🚀 Key Features**

- **Secure Authentication:** Implemented JWT-based authentication with silent refresh tokens and HTTP-only cookies for maximum security.
- **Role-Based Access Control (RBAC):** Distinct permissions for **Employees**, **Managers**, and **Admins**.
- _Employees_ can view and edit only those assigned to them.
- _Managers/Admins_ have full CRUD authority over users and tickets.

- **Real-time Ticketing:** A robust dashboard featuring "fuzzy" search (Ticket # or Title), status filtering (Open/Closed), and automated ticket numbering.
- **Modern UI/UX:** Built with a "Dark Mode" aesthetic using Tailwind CSS and shadcn for accessible, professional components.
- **Resilient Data Fetching:** Utilizes TanStack Query for sophisticated server-state management, including caching, debounced searching, and optimistic-feeling updates.

---

### **💻 Tech Stack**

| Layer             | Technologies                                                                     |
| ----------------- | -------------------------------------------------------------------------------- |
| **Frontend**      | React 18, TypeScript, TanStack Query (v5), Zustand, Tailwind CSS, React Router 6 |
| **Backend**       | Node.js, Express.js, MongoDB, Mongoose                                           |
| **Security**      | JWT (Access/Refresh Tokens), argon2, CORS, Cookie-parser                         |
| **UI Components** | shadcn, Lucide React                                                             |

---

### **📈 Business Impact & Solved Problems**

- **Eliminated Data Loss:** Replaced physical paper trails with a MongoDB-backed persistent database.
- **Accountability:** Added "Assigned Technician" tracking so managers know exactly who is working on what.
- **Concurrency Handling:** Used TanStack Query to ensure multiple managers can view the same live data without manual page refreshes.
- **Safety Nets:** Integrated "Confirm Delete" modals to prevent accidental data destruction.

---

### **🚦 Getting Started**

#### **Prerequisites**

- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)

#### **Installation**

1. **Clone the repo**

```bash
git clone https://github.com/hermanconnor/technotes.git
cd technotes
```

2. **Setup Environment Variables**
   Create a `.env` file in both the `/backend` and `/frontend` directories.

```env
# Backend .env
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000
DATABASE_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret

```

3. **Install Dependencies**

```bash
# Install backend dependencies
cd backend && npm install

# Open a new terminal instance, or navigate back to root and into frontend
cd ../frontend && npm install
```

4. **Run the Project**

```bash
cd backend
npm run dev

cd frontend
npm run dev
```

---

## 🧠 Challenges & Solutions

### 1. The "Stale Data" Problem in a Multi-User Environment

**The Challenge:** In a physical "sticky note" system, only one person can hold the note. In a digital app, two managers might try to edit the same ticket at once. How do we ensure the UI stays in sync without making the user manually refresh?

**The Solution:** I implemented **TanStack Query** with a global `staleTime` and `refetchOnWindowFocus` configuration.

- Whenever a technician switches back to the browser tab, the app automatically triggers a background fetch.
- I used **cache invalidation** in the `onSuccess` handlers of every mutation. As soon as a ticket is updated, the list is marked as "stale," triggering an immediate background refresh that keeps all users synced with the server’s "Source of Truth."

---

### 2. Secure Authentication vs. User Experience

**The Challenge:** Storing JWTs in `localStorage` makes the app vulnerable to XSS attacks, but storing them in memory means the user is logged out every time they refresh the page.

**The Solution:** I developed a **Double-Token Persistence Strategy**.

- The **Refresh Token** is stored in a secure, `httpOnly` cookie (invisible to JavaScript, protecting against XSS).
- The **Access Token** is kept in memory (Zustand state).
- I configured **Axios Interceptors** to detect `403 Forbidden` errors. When an access token expires, the interceptor automatically calls the `/refresh` endpoint to get a new token using the cookie and retries the original request. The user never sees a login screen unless their session truly expires.

---

### 3. Role-Based UI Complexity

**The Challenge:** Different users need different tools. Showing "Delete" buttons or "User Management" links to regular technicians creates UI clutter and potential security risks.

**The Solution:** I implemented **Conditional Component Rendering** paired with a specialized `RequireAuth` higher-order component.

- The UI dynamically adjusts by checking the `roles` array in the global Auth state.
- For security, I enforced **Server-Side Validation**: even if a user bypasses the UI and attempts a DELETE request via the API, the backend middleware verifies their role before executing the command.

---

## 🗺️ Future Improvements

### 1. Automated Email & Push Notifications

Currently, technicians must check the dashboard to see new assignments.

- **The Goal:** Integrate **Nodemailer** or **SendGrid** to trigger instant email alerts when a ticket is assigned to a specific user or when a high-priority ticket is created.

### 2. File & Image Attachments

- **The Goal:** Implement **AWS S3** or **Cloudinary** integration to allow technicians to upload photos of broken equipment directly into the ticket description.

### 3. 💬 Internal Comment Threading

Complex issues often require a conversation between the manager and the technician.

- **The Goal:** Add a nested "Comments" section to each ticket, moving communication out of external chat apps and keeping the entire history of the fix in one place.

---
