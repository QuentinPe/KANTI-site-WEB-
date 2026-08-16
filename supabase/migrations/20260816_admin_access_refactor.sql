-- ============================================================
-- Migration: Admin Access Refactor
-- Run once in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Extend admin_users
-- -----------------------------------------------------------------
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS status        text        DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
  ADD COLUMN IF NOT EXISTS permissions   jsonb       DEFAULT '[]'::jsonb;

-- 2. Backfill status based on existing active flag
UPDATE admin_users
  SET status = CASE WHEN active THEN 'active' ELSE 'disabled' END
  WHERE status IS NULL OR status = 'active';

-- 3. Enforce NOT NULL now that rows are backfilled
ALTER TABLE admin_users
  ALTER COLUMN status SET NOT NULL;

-- 4. Create admin_activity_logs
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id     text        NOT NULL,
  action       text        NOT NULL,
  target_email text,
  metadata     jsonb       DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_activity_logs' AND policyname = 'Admins can read activity logs'
  ) THEN
    CREATE POLICY "Admins can read activity logs"
      ON admin_activity_logs FOR SELECT TO authenticated
      USING (auth.jwt()->>'email' IN (SELECT email FROM admin_users WHERE active = true));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_activity_logs' AND policyname = 'Admins can write activity logs'
  ) THEN
    CREATE POLICY "Admins can write activity logs"
      ON admin_activity_logs FOR INSERT TO authenticated
      WITH CHECK (auth.jwt()->>'email' IN (SELECT email FROM admin_users WHERE active = true));
  END IF;
END
$$;
