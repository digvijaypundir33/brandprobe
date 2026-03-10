-- Testimonials table for managing homepage testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  website_url VARCHAR(500),
  testimonial_text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active, display_order);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

-- Insert existing testimonials
INSERT INTO testimonials (author_name, author_role, company_name, website_url, testimonial_text, rating, is_featured, display_order, is_active)
VALUES
  ('DJ', 'Founder, ChatCrafterAI', 'ChatCrafterAI', 'https://chatcrafterai.com', 'BrandProbe helped us identify critical messaging gaps in ChatCrafterAI. The AI Search optimization recommendations were spot-on.', 5, true, 1, true),
  ('DJ', 'Founder, WorkoutPro AI', 'WorkoutPro AI', 'https://workoutproai.com', 'The technical SEO audit for WorkoutPro AI revealed issues we didn''t know existed. Implemented the fixes and saw immediate improvements in search visibility.', 5, true, 2, true);
