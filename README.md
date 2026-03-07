# AI Resume Builder

A full-stack web application created with **Next.js 14+ (App Router)**, **Tailwind CSS**, **Supabase Auth and Database**, and **OpenRouter LLM API**. It allows users to create professional resumes, enhance phrasing using AI, preview their resume in real-time, and download it as a PDF.

## 🌟 Features

- **User Authentication**: Secure Login, Signup, and session management using Supabase Auth.
- **Dashboard**: View all saved resumes or create new ones.
- **AI Resume Enhancement**: Selectively rewrite and improve resume summaries and work experience points using state-of-the-art LLMs via the OpenRouter API.
- **Live Preview**: Clean, side-by-side editing and previewing mapped to an A4 layout.
- **PDF Export**: Generate accurate, styling-intact PDFs natively using `html2canvas` and `jsPDF`.

---

## 🛠 Prerequisites

- Node.js (v18.x or later recommended)
- A Supabase Project (for Postgres Auth & Database)
- An OpenRouter Account (for AI LLM access)
- Git installed on your system

---

## 🚀 Setup & Installation Steps

### 1. Clone or Initialize the Repository

If you haven't yet, initialize your project setup.
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Schema (Supabase)

Go to your Supabase Project dashboard -> **SQL Editor** -> **New Query**.
Copy the contents of `supabase/schema.sql` (found in the root folder of this project) and run it. This script:
- Creates the `resumes` table.
- Enables Row Level Security (RLS) policies ensuring users can only read, write, and delete their own resumes.

### 4. Configuration Settings

Check your `.env.local.example` file and create a `.env.local` file in the project's root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

- You can find your **Supabase URL and Anon Key** under **Project Settings -> API** in Supabase.
- You can get your **OpenRouter API Key** at [openrouter.ai](https://openrouter.ai/keys).

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🗄 Project Architecture

- **`/src/app/page.tsx`**: High-conversion landing page outlining features.
- **`/src/app/(auth)/login/page.tsx & signup`**: Supabase authentication routes.
- **`/src/app/dashboard/page.tsx`**: Resume overview showing a user's collection.
- **`/src/app/resume/[id]/page.tsx`**: Core Editor orchestrating the UI splitting.
- **`/src/components/ResumeForm.tsx`**: Handles form states, arrays, and triggers API route calls to rewrite elements using OpenRouter.
- **`/src/components/ResumePreview.tsx`**: Maps the user's JSON structure visually into an A4 aspect box.
- **`/src/app/api/generate-resume/route.ts`**: Safely abstracts calling OpenRouter AI API.

---

## ☁️ Deployment on Vercel

### Step 1: Push to GitHub
Create a GitHub repository and push your local branch up.

```bash
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
2. Select the GitHub Repository you just pushed.
3. Once selected, open the **Environment Variables** section.
4. Add the following keys identically to your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`
5. Click **Deploy**. Vercel will build and deploy the application within a few minutes.

## Important Considerations
* **Next.js Caching**: Depending on requirements, API routes interacting with the DB or third parties might be dynamically rendered. Ensure route handlers use explicit options like `export const dynamic = 'force-dynamic'` when needed, though Next.js usually detects dynamic usage like `headers()` gracefully.

---
*Created carefully as a beginner-friendly showcase setup.*
