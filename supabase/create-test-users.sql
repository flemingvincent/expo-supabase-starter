-- Create Test Users for Development/Testing
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- Note: These users will be created with verified emails
-- Passwords are set directly for testing purposes

-- Test User 1: Demo User
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data,
    aud,
    role
) VALUES (
    gen_random_uuid(),
    'demo@example.com',
    crypt('Demo123456', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
        'name', 'Demo User',
        'display_name', '演示用户'
    ),
    jsonb_build_object('provider', 'email'),
    'authenticated',
    'authenticated'
);

-- Test User 2: Test Student
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data,
    aud,
    role
) VALUES (
    gen_random_uuid(),
    'student@example.com',
    crypt('Student123', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
        'name', 'Test Student',
        'display_name', '测试学生'
    ),
    jsonb_build_object('provider', 'email'),
    'authenticated',
    'authenticated'
);

-- Test User 3: Teacher Account
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data,
    aud,
    role
) VALUES (
    gen_random_uuid(),
    'teacher@example.com',
    crypt('Teacher123', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
        'name', 'Test Teacher',
        'display_name', '测试老师'
    ),
    jsonb_build_object('provider', 'email'),
    'authenticated',
    'authenticated'
);

-- Alternative method using Supabase's auth functions (recommended)
-- This method properly handles all auth requirements

-- Create test users using auth.signup() function
-- Note: Run these separately in Supabase Dashboard

/*
-- User 1
SELECT auth.signup(
    'test@example.com',
    'Test123456',
    '{"name": "Test User", "display_name": "测试用户"}'::jsonb
);

-- User 2  
SELECT auth.signup(
    'student1@example.com',
    'Student123',
    '{"name": "Student One", "display_name": "学生一"}'::jsonb
);

-- User 3
SELECT auth.signup(
    'admin@example.com',
    'Admin123456',
    '{"name": "Admin User", "display_name": "管理员"}'::jsonb
);
*/