import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project's values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://flztnnnczyowtxynxhun.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsenRubm5jenlvd3R4eW54aHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMTMwMzAsImV4cCI6MjA0NzU4OTAzMH0.227ea6MvVytEbaAAtlAwCmuzaNn5xP33WkyPbNp4WEM';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
