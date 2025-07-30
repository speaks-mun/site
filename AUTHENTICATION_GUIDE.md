# 🔐 AUTHENTICATION TROUBLESHOOTING GUIDE

## ✅ **COMPLETED TASKS**
- ✅ Login status indicators on ALL pages
- ✅ Condensed filter system in discover page  
- ✅ Airtight middleware with route protection
- ✅ Build-safe environment variable handling

---

## 🚨 **IMMEDIATE FIX REQUIRED: Database Error**

### **Issue**: `Database error saving new user` after Google OAuth

### **Root Cause Analysis**:
The error occurs because:
1. **Missing Supabase Function**: The `handle_new_user()` function might not exist
2. **Disabled Trigger**: The `on_auth_user_created` trigger might be disabled
3. **RLS Policies**: Row Level Security might be blocking user creation
4. **Table Structure**: The `users` table might have missing columns

### **STEP-BY-STEP FIX**:

#### **1. Check Supabase Dashboard**
Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]

#### **2. Verify Database Function** 
**SQL Editor → Run this query:**
```sql
-- Check if function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- If it doesn't exist, create it:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, onboarding_completed)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### **3. Check/Create Trigger**
```sql
-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- If missing, create it:
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### **4. Verify Users Table Structure**
```sql
-- Check table exists with correct columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- If table doesn't exist, create it:
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  college_affiliation TEXT,
  is_organizer BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```

#### **5. Fix RLS Policies**
```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for user management
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to insert (for trigger)
CREATE POLICY "Enable insert for service role" ON public.users
  FOR INSERT WITH CHECK (true);
```

#### **6. Test the Fix**
```sql
-- Test the function manually
SELECT public.handle_new_user();

-- Check recent auth users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Check users table
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;
```

---

## 🛡️ **SECURITY CHECKLIST** (Already Implemented)

### **✅ Route Protection**
- All `/discover`, `/create-event`, `/profile`, etc. routes are protected
- Unauthenticated users redirected to `/auth/login`
- Authenticated users redirected away from login pages

### **✅ Environment Variables**
- No hardcoded Supabase keys in source code
- Build-safe fallbacks prevent deployment errors
- Runtime validation ensures production security

### **✅ Middleware Security**
- Organizer-only routes (create-event) have additional checks
- Error handling prevents information leaks
- Cookie-based session management

---

## 🔧 **ENVIRONMENT SETUP CHECKLIST**

### **Vercel Environment Variables** (Set these in Vercel Dashboard):
```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_BASE_URL=https://[your-vercel-domain].vercel.app
```

### **Supabase Configuration**:
1. **Authentication → URL Configuration**:
   - Site URL: `https://[your-vercel-domain].vercel.app`
   - Redirect URLs: `https://[your-vercel-domain].vercel.app/auth/callback`

2. **Authentication → Providers → Google**:
   - Enable Google provider
   - Add your Google OAuth credentials
   - Authorized origins: `https://[your-vercel-domain].vercel.app`

---

## 🎯 **IMMEDIATE NEXT STEPS**

### **Priority 1: Fix Authentication**
1. Run the SQL commands above in Supabase
2. Test OAuth login - should work without database error
3. Verify user creation in `public.users` table

### **Priority 2: Test User Experience**  
1. Complete OAuth flow - check for success banner
2. Navigate between pages - verify login indicators
3. Test logout and login again

### **Priority 3: Polish Experience**
1. Add Google Maps API key to Vercel
2. Test event discovery and filtering
3. Complete invite system for organizers

---

## 📞 **Support Debugging**

### **Common Issues & Fixes**:

**Issue**: "Missing Supabase environment variables"
- **Fix**: Add environment variables to Vercel Dashboard

**Issue**: "OAuth redirect loop"  
- **Fix**: Check Supabase redirect URLs match your domain exactly

**Issue**: "Function doesn't exist"
- **Fix**: Run the `handle_new_user` function creation SQL

**Issue**: "Permission denied"
- **Fix**: Update RLS policies as shown above

### **Debug Logs to Check**:
1. Vercel Function Logs (for server errors)
2. Browser Console (for client errors)  
3. Supabase Auth logs (for OAuth issues)
4. Supabase Database logs (for trigger issues)

---

## 🚀 **SUCCESS INDICATORS**

You'll know authentication is working when:
- ✅ Google OAuth completes without database error
- ✅ User sees success banner on onboarding page
- ✅ Welcome banner appears on discover page with user's name/photo
- ✅ User profile picture shows in top navigation
- ✅ All protected routes work correctly
- ✅ Logout redirects properly to landing page

---

**PRIORITY**: Fix the database error first, then test the complete user flow!