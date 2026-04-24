-- ── DELPHI ORACLE — Initial Schema ────────────────────────────────────────

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT,
  operator_id TEXT DEFAULT 'ANALYST_D1',
  clearance   INTEGER DEFAULT 5,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── DECISIONS ─────────────────────────────────────────────────────────────
CREATE TABLE decisions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref              TEXT NOT NULL,
  title            TEXT NOT NULL,
  context          TEXT,
  decision_type    TEXT DEFAULT 'strategic',
  gravity          NUMERIC(4,1),
  impact           INTEGER CHECK (impact BETWEEN 1 AND 10),
  urgency          INTEGER CHECK (urgency BETWEEN 1 AND 10),
  uncertainty      INTEGER CHECK (uncertainty BETWEEN 1 AND 10),
  irreversibility  INTEGER CHECK (irreversibility BETWEEN 1 AND 10),
  authority        TEXT DEFAULT 'HIGH',
  routing          TEXT CHECK (routing IN ('ACT','ESCALATE','DEFER')),
  confidence       INTEGER,
  reversibility    INTEGER,
  option_value     NUMERIC(4,1),
  fragility        NUMERIC(4,1),
  status           TEXT DEFAULT 'PENDING',
  path             TEXT[],
  inverse          TEXT,
  exegesis         TEXT,
  conditions       TEXT[],
  tags             TEXT[],
  owner_id         UUID REFERENCES profiles(id),
  deadline         DATE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read decisions" ON decisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users insert decisions" ON decisions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users update own decisions" ON decisions FOR UPDATE TO authenticated USING (owner_id = auth.uid());

-- ── DECISION LOG (append-only) ────────────────────────────────────────────
CREATE TABLE decision_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id  UUID REFERENCES decisions(id),
  ref          TEXT NOT NULL,
  title        TEXT NOT NULL,
  status       TEXT CHECK (status IN ('COMMITTED','SIMULATED','DISCARDED')),
  description  TEXT,
  success_prob INTEGER,
  impact_delta TEXT,
  reversibility INTEGER,
  tags         TEXT[],
  logged_by    UUID REFERENCES profiles(id),
  logged_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE decision_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read log" ON decision_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users insert log" ON decision_log FOR INSERT TO authenticated WITH CHECK (true);

-- ── AFTER-ACTION REVIEWS ──────────────────────────────────────────────────
CREATE TABLE after_action_reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id       UUID REFERENCES decisions(id),
  status            TEXT DEFAULT 'WAITING_DATA',
  predicted_outcome INTEGER,
  actual_outcome    INTEGER,
  calibration_delta INTEGER,
  lessons           TEXT[],
  bias_scores       JSONB DEFAULT '{}',
  owner_id          UUID REFERENCES profiles(id),
  due_at            TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE after_action_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read AAR" ON after_action_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users manage AAR" ON after_action_reviews FOR ALL TO authenticated USING (true);

-- ── DECISION AUTHORITY MATRIX ─────────────────────────────────────────────
CREATE TABLE dam_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type   TEXT NOT NULL,
  authority_level TEXT NOT NULL,
  threshold       TEXT,
  status          TEXT DEFAULT 'ACTIVE',
  auth_score      INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE dam_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read DAM" ON dam_entries FOR SELECT TO authenticated USING (true);

-- ── REVERSIBILITY DEBTS ────────────────────────────────────────────────────
CREATE TABLE reversibility_debts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref         TEXT NOT NULL,
  label       TEXT NOT NULL,
  debt_type   TEXT,
  severity    TEXT CHECK (severity IN ('HIGH','MEDIUM','LOW')),
  amount      NUMERIC(12,2),
  decision_id UUID REFERENCES decisions(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reversibility_debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read debts" ON reversibility_debts FOR SELECT TO authenticated USING (true);

-- ── WORKSPACE CLUSTERS ────────────────────────────────────────────────────
CREATE TABLE clusters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  session_id  TEXT,
  status      TEXT DEFAULT 'ACTIVE',
  description TEXT,
  progress    INTEGER DEFAULT 0,
  risk_level  TEXT DEFAULT 'MEDIUM',
  decision_id UUID REFERENCES decisions(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read clusters" ON clusters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users manage clusters" ON clusters FOR ALL TO authenticated USING (true);

-- ── CLUSTER MEMBERS ───────────────────────────────────────────────────────
CREATE TABLE cluster_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id   UUID REFERENCES clusters(id) ON DELETE CASCADE,
  member_type  TEXT CHECK (member_type IN ('human','agent')),
  name         TEXT NOT NULL,
  role         TEXT,
  load_pct     INTEGER DEFAULT 0,
  status       TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE cluster_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read members" ON cluster_members FOR SELECT TO authenticated USING (true);

-- ── WORKSPACE FEED (real-time) ────────────────────────────────────────────
CREATE TABLE workspace_feed (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id  UUID REFERENCES clusters(id),
  author      TEXT NOT NULL,
  author_type TEXT CHECK (author_type IN ('human','agent')),
  content     TEXT NOT NULL,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE workspace_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read feed" ON workspace_feed FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users post to feed" ON workspace_feed FOR INSERT TO authenticated WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE workspace_feed;

-- ── HANDOFFS ──────────────────────────────────────────────────────────────
CREATE TABLE handoffs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES clusters(id),
  from_name  TEXT NOT NULL,
  from_type  TEXT,
  to_name    TEXT NOT NULL,
  to_type    TEXT,
  content    TEXT,
  is_urgent  BOOLEAN DEFAULT FALSE,
  status     TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE handoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read handoffs" ON handoffs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users manage handoffs" ON handoffs FOR ALL TO authenticated USING (true);

-- ── SEED DATA ─────────────────────────────────────────────────────────────

INSERT INTO dam_entries (decision_type, authority_level, threshold, status, auth_score) VALUES
  ('Budget Reallocation',  'Executive',  '>$500K',          'ACTIVE',     9),
  ('Market Entry',         'Board',      'New Region',       'ACTIVE',     10),
  ('Technical Architecture','CTO',       'Core Infra',       'DELEGATED',  7),
  ('Hiring >VP Level',     'CEO',        '>L8',             'ACTIVE',     9),
  ('Partner Agreements',   'Strategy',   '>$100K ARR',      'ACTIVE',     6),
  ('Product Roadmap Q+2',  'CPO',        'Major Features',  'DELEGATED',  7);

INSERT INTO reversibility_debts (ref, label, debt_type, severity, amount) VALUES
  ('DEB-011','ARM Migration Lock-In',      'Infrastructure', 'HIGH',   45000),
  ('DEB-012','Vendor API Exclusivity',     'Contractual',    'HIGH',   38000),
  ('DEB-013','Legacy Auth Dependency',     'Technical',      'MEDIUM', 29500),
  ('DEB-014','Monolithic Data Layer',      'Architecture',   'MEDIUM', 30000);
