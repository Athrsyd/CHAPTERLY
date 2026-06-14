-- ============================================================
--  CHAPTERLY — Supabase SQL Schema
--  Paste this into the Supabase SQL Editor and run it.
-- ============================================================

-- ── 1. USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(10)     NOT NULL DEFAULT 'reader'
                CHECK (role IN ('reader', 'author', 'owner'))
);

-- ── 2. BOOKS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    cover       TEXT,                           -- URL / path to image
    author_id   INT             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    genre       VARCHAR(100),
    price       DECIMAL(10, 2)  NOT NULL DEFAULT 0,
    rate        INT             NOT NULL DEFAULT 0 CHECK (rate BETWEEN 0 AND 5),
    description TEXT
);

-- ── 3. RENT_BOOKS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rent_books (
    id          SERIAL PRIMARY KEY,
    user_id     INT             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id     INT             NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    rent_time   DATE            NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE (user_id, book_id)   -- prevent duplicate active rents
);

-- ── 4. HISTORY_RENT ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS history_rent (
    id              SERIAL PRIMARY KEY,
    rent_id         INT     NOT NULL REFERENCES rent_books(id) ON DELETE CASCADE,
    finished_date   DATE    NOT NULL DEFAULT CURRENT_DATE
);

-- ── 5. AUTHOR_APPLYING ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS author_applying (
    id          SERIAL PRIMARY KEY,
    user_id     INT     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason      TEXT    NOT NULL,
    status      VARCHAR(10) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)    -- one active application per user
);

-- ── SEED: default owner account ─────────────────────────────
-- Password: owner123  (change immediately after setup!)
-- Hash generated with bcrypt rounds=12
INSERT INTO users (name, email, password, role)
VALUES (
    'Super Admin',
    'owner@chapterly.com',
    '$2b$12$placeholder_replace_with_real_bcrypt_hash',
    'owner'
) ON CONFLICT (email) DO NOTHING;
