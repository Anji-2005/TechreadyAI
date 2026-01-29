# 🚀 TechReady AI

**TechReady AI** is a full-stack placement readiness dashboard designed for Indian tech students.  
It helps students understand *where they stand*, *what to prepare*, and *when hiring happens* — all in one place.

The platform combines resume analysis, role-specific preparation guidance, and a real hiring calendar backed by a database.

---

## 🎯 Problem Statement

Many students preparing for placements struggle with:
- Lack of clarity on **role-specific preparation**
- No visibility into the **Indian hiring timeline**
- Generic advice instead of **structured, actionable guidance**
- No centralized dashboard to track readiness

---

## 💡 Solution

TechReady AI provides a **single dashboard** that delivers:
- Resume-based readiness insights
- A **4-week personalized roadmap**
- A **database-backed Indian hiring calendar**
- **Role-based preparation checklists**
- Clear “How to prepare for this role” guidance

All built with a scalable full-stack architecture.

---

## 🧠 Key Features

### 1️⃣ Placement Readiness Analysis
- ATS-style score (out of 100)
- Readiness summary
- Skills present vs skills missing
- Resume improvement suggestions
- Personalized 4-week preparation roadmap

---

### 2️⃣ Indian Hiring Calendar (Database-Backed)
- Shows **current-month hiring focus by default**
- Real hiring events (campus, internships, consulting, tech roles)
- Persisted using MongoDB
- Easy to extend with future hiring seasons

---

### 3️⃣ Role-Based Preparation Checklist
- Checklist varies by role (SDE, Data Analyst, ML Engineer, etc.)
- Tracks preparation progress
- Data persists across refreshes
- Helps students stay accountable

---

### 4️⃣ “How to Prepare for This Role” Guide
- Clear explanation of:
  - Core skills
  - Tools & technologies
  - Interview expectations
- Written in student-friendly language
- Role-specific and structured

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- React Router
- Component-based dashboard architecture

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- REST APIs for dashboard widgets

### Database
- MongoDB Atlas
- Persistent data for:
  - Hiring events
  - Role checklists
  - Role preparation guides

---
## 🧪 Current AI Status

- Resume analysis is **rule-based / mocked** for now
- Designed to be replaced with:
  - LLM-based resume parsing
  - Embedding-based ATS scoring
  - Skill gap detection via AI

This ensures the platform is **production-ready for real AI integration**.

---

## 🔮 Future Enhancements

- Actual AI resume parsing & scoring
- PDF resume upload & analysis
- Progress analytics over time
- Company-specific preparation paths
- Deployed public version (Vercel + Render)

---

## 📌 Note to Judges

This project focuses on **system design, data persistence, and real-world usability**.  
AI components are intentionally modular and can be upgraded without changing the core architecture.
