# 🎬 MovieHub

**MovieHub** is a full-stack web application that allows users to browse, review, and manage a personalized watchlist of movies. Administrators can manage actors, directors, and movie details. The system also includes a real-time notification system that emails users when a movie on their watchlist is released.

---

## 📌 Features

### 👩‍💼 Admin Capabilities
- Secure login with admin credentials
- Create, update, delete movie, actor, and director records
- Assign actors to movies
- Set release status of movies
- View movie casts and actor appearances

### 👤 User Capabilities
- Register and login securely
- Browse and filter movie catalog
- Leave, edit, and delete reviews with ratings (1–5 stars)
- Add/remove movies from watchlist
- Receive email notifications when a watchlisted movie is released
- Manage profile and watchlist from account page

---
## ✨ UI Screenshots

<!-- Replace with actual image paths -->
- User Dashboard  
  ![User Dashboard](path/to/user-dashboard.png)

- Admin Panel  
  ![Admin Panel](path/to/admin-panel.png)

- Movie List View  
  ![Movie List](path/to/movie-list.png)

- Watchlist Page  
  ![Watchlist](path/to/watchlist.png)

## 🧱 Tech Stack

### Frontend
- React + TypeScript
- React Data Table Component
- React-Toastify

### Backend
- Spring Boot
- Spring Security (JWT-based authentication)
- Spring Data JPA + Hibernate
- Lombok
- JavaMailSender for email service

### Database
- PostgreSQL
- pgAdmin

### Testing
- JUnit 5
- Mockito
- Spring Boot Test + MockMvc

---

## 🧠 System Architecture

MovieHub follows a layered architecture:

1. **Presentation Tier** – Built with React + TypeScript
2. **Application Tier** – REST API using Spring Boot
3. **Data Tier** – PostgreSQL database
4. **Testing Layer** – JUnit and Mockito for integration/unit testing


## 🗂️ Data Model

**Entities:**
- Person (user)
- Movie
- Actor
- Director
- Review
- ForgotPassword (for OTP-based reset)
- Watchlist

**Relationships:**
- Many-to-Many: Movie ⇄ Actor
- One-to-Many: Director → Movie
- One-to-Many: Person → Review, Movie → Review
- One-to-One: Person → ForgotPassword

<!-- Add your ERD diagram below -->
![ERD Diagram](path/to/your/erd-diagram.png)


## 📬 Email Notification System

Implements the **Observer Pattern**:
- Users are "observers" subscribed to movie release notifications.
- When a movie status changes to "released", users with that movie in their watchlist receive an email automatically.

