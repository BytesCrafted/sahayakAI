# Sahayak: Empowering Teachers in Multi-Grade Classrooms

> An AI-powered teaching assistant designed to support educators in under-resourced, multi-grade classrooms across India.

## Problem Statement

In many schools across India, a single teacher is often responsible for managing multiple grades within one classroom. These teachers face numerous challenges:
- Limited time and resources.
- Need for personalized and localized teaching aids.
- Difficulty addressing varying learning levels.

**Sahayak** is an AI-driven web application designed to **lessen this burden** and **amplify teacher impact** by offering intelligent tools, automation, and multilingual support.

---

## Key Features

### 👩‍🏫 Teacher Dashboard
- Create and manage **tasks** (daily, weekly, monthly, yearly).
- **Create and manage classrooms** with:
  - Student lists
  - Attendance tracking
  - Progress analysis
  - Content feed for assigned materials

- **Evaluate** student submissions for quizzes and assignments using AI-powered analysis.

### Content Studio
- **Hyper-local content generation** using AI agents.
- **Image to worksheet** conversion tool.
- Generate:
  - **Lesson plans**
  - **Study materials**
  - **Quizzes & assignments**

### Ask Sahayak (Chat Assistant)
- A smart conversational agent for:
  - Pedagogical help
  - Instant teaching resources
  - Classroom suggestions

### Resource Library
- Add and share content with the **global teacher community**.
- Prevents duplication and encourages collaboration.

---

## Technology Stack

### Frontend
- **Flutter Web** (powered by Firebase Studio)

### Backend & Database
- **Firebase Authentication**
- **Cloud Firestore (NoSQL DB)**
- **Firebase Storage**

### Cloud & AI Services
- **Google Cloud Platform (GCP)** for API hosting
- **Google Agent Development Kit**:
  - Content Generation Agent
  - Ask Sahayak Agent
  - Evaluation Agent
- **Google Document AI** for quiz/assignment evaluation
- **Google Translate API** for multilingual content support

---

## AI Agent Architecture

- **Content Generation Agent**: Helps create worksheets, lesson plans, and study materials tailored to classroom needs.
- **Ask Sahayak Agent**: Offers conversational assistance and real-time teaching help.
- **Evaluation Agent**: Automatically reviews student answers and provides performance insights.

---

## Multilingual Support

To ensure accessibility across regions:
- Uses **Google Translate API** for content and UI translation.
- Teachers can select preferred language during onboarding.

---

## Repository Structure

```bash
├── lib/
│   ├── features/              # Core app features (dashboard, tasks, classrooms)
│   ├── data/                  # Firebase models and repositories
│   ├── agents/                # Agent integrations (content, evaluation, chat)
│   └── main.dart              # App entry point
├── public/                    # Web assets and hosting config
├── firebase.json              # Firebase configuration
├── README.md                  # Project overview and documentation
└── ...
