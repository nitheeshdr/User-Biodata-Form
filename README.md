# User-Biodata-Form

A React app built with Vite, Tailwind CSS, and Supabase that allows users to create, fetch, and update biodata with profile image upload support.

---

## Features

- Create new user with username, name, email, age, and profile image upload
- Fetch user by username or email
- Edit/update user details including profile image
- Image upload and storage in Supabase Storage bucket
- Responsive UI with Tailwind CSS

---

## Demo

(You can add your deployed URL here once hosted on Vercel)

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Supabase (Database + Storage)
- UUID for unique image names

---

## Prerequisites

- Node.js v16+
- Supabase project with:
  - `users` table (username, name, email, age, profile_url)
  - `avatars` storage bucket (public)
- Supabase API URL and Anon key

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/nitheeshdr/User-Biodata-Form.git
cd User-Biodata-Form
2. Install dependencies
bash
Copy
Edit
npm install
3. Configure Supabase
Create a .env file in the root folder and add:

env
Copy
Edit
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
Replace your-supabase-url and your-anon-key with your Supabase project credentials.

4. Run locally
bash
Copy
Edit
npm run dev
The app will be available at http://localhost:5173 (or the port shown in the console).

Deployment on Vercel
Push your code to GitHub (User-Biodata-Form repo).

Go to https://vercel.com and sign in with GitHub.

Import your User-Biodata-Form repo.

In the project settings, add environment variables:

ini
Copy
Edit
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
Deploy the project.

Supabase Table Schema
users table columns:

Column	Type	Nullable	Notes
id	uuid	No	Primary key, default uuid_generate_v4()
username	text	No	Unique
name	text	Yes	
email	text	No	Unique
age	integer	Yes	
profile_url	text	Yes	Public URL of image
created_at	timestamp	No	Default now()

Supabase Policies
Make sure RLS is enabled, and add these policies:

Insert:

sql
Copy
Edit
CREATE POLICY "Allow insert for everyone"
ON public.users
FOR INSERT
TO public
WITH CHECK (true);
Update:

sql
Copy
Edit
CREATE POLICY "Allow update for everyone"
ON public.users
FOR UPDATE
TO public
USING (true);
Select:

sql
Copy
Edit
CREATE POLICY "Allow select for everyone"
ON public.users
FOR SELECT
TO public
USING (true);
Notes
Ensure your avatars bucket is public in Supabase Storage for image URLs to work.

This is a beginner-friendly project; feel free to improve auth, validations, and security.

License
MIT © Nitheesh D R

