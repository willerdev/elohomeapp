import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asxsxkbfxzkzsceudhxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeHN4a2JmeHprenNjZXVkaHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTYyNzksImV4cCI6MjA0NzM5MjI3OX0.LzNbDBUE_0LGm5TMZKu0KclR2zqA52cv-iZqOP433NQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);