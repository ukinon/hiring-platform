# Hiring Management Platform

A comprehensive hiring management web application built with Next.js that enables recruiters (Admin) to manage job vacancies and applicants (Job Seekers) to apply for positions.

## Project Overview

This platform provides two distinct user experiences:

- **Admin/Recruiter**: Create and manage job postings, configure application requirements, and review candidate applications
- **Applicant/Job Seeker**: Browse active job listings, submit applications with dynamic form validation, and capture profile photos using hand gesture recognition

## Tech Stack Used

### Framework & Language

- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe development

### Styling & UI

- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

### State Management & Data Fetching

- **TanStack React Query (v5)** - Server state management
- **TanStack React Table (v8)** - Table management with resizing/sorting
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend & Database

- **Supabase** - PostgreSQL database and authentication
- **Supabase SSR** - Server-side rendering support

### Special Features

- **MediaPipe Hands** - Hand gesture detection for photo capture
- **React Webcam** - Camera integration
- **date-fns** - Date formatting utilities

### Development Tools

- **NPM** - Package manager
- **ESLint** - Code linting
- **Next.js Turbopack** - Fast bundler

## 📦 How to Run Locally

### Prerequisites

- **Npm** installed (or Node.js 18+)
- **Supabase** account and project

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hiring-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up database schema**
   Run the following SQL in your Supabase SQL Editor:

   ```sql
   -- Create enum for field status
   CREATE TYPE field_status AS ENUM ('required', 'not_required');

   -- Create jobs table
   CREATE TABLE jobs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     department TEXT,
     company TEXT,
     type TEXT NOT NULL,
     description TEXT NOT NULL,
     needed_candidates INTEGER DEFAULT 1,
     min_salary NUMERIC,
     max_salary NUMERIC,
     currency TEXT DEFAULT 'IDR',
     display_text TEXT NOT NULL,
     slug TEXT NOT NULL,
     status TEXT NOT NULL,
     badge TEXT NOT NULL,
     cta TEXT NOT NULL,
     started_on_text TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create job_config table
   CREATE TABLE job_config (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
     title TEXT,
     full_name field_status,
     email field_status,
     phone_number field_status,
     photo_profile field_status,
     gender field_status,
     domicile field_status,
     date_of_birth field_status,
     linkedin_link field_status,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create candidates table
   CREATE TABLE candidates (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
     full_name TEXT,
     email TEXT,
     phone_number BIGINT,
     gender TEXT,
     domicile TEXT,
     date_of_birth DATE,
     linkedin_link TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create users table (for admin authentication)
   CREATE TABLE users (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     username TEXT,
     role TEXT DEFAULT 'user',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)
