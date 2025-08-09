# 🚀 Supabase Setup Instructions

## Step 1: Run the Schema
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content of `supabase-schema.sql`
4. Click **Run** to create all tables and functions

## Step 2: Update Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Step 3: Test the Setup
1. Visit `/api/debug/users` to check database connection
2. Try registering a new user
3. Try logging in with the new user
4. Check if you get redirected to the account dashboard

## Step 4: Remove Old Files (Optional)
After confirming everything works, you can remove:
- `lib/database/connection.ts`
- `lib/database/hybrid.ts` 
- Any MongoDB-related files

## What's Changed:
✅ **Single Database**: Only Supabase PostgreSQL
✅ **Simplified Auth**: Clean user creation and login
✅ **Built-in Gamification**: Points, badges, daily activities
✅ **Auto-generated Panda IDs**: Unique user identifiers
✅ **Row Level Security**: Secure data access
✅ **Real-time Ready**: Can add real-time features later

## Benefits:
- 🔥 **Much Faster**: Single database queries
- 🛡️ **More Secure**: Built-in RLS and auth
- 🧹 **Cleaner Code**: No hybrid complexity
- 📈 **Scalable**: Supabase handles scaling
- 🔧 **Easier Debugging**: Single source of truth