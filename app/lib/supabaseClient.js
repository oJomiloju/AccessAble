import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrzpxbyrycmdxghmytdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yenB4YnlyeWNtZHhnaG15dGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMzUxMTEsImV4cCI6MjA1MDkxMTExMX0.uytM1Pa-6S3Ox6nWO8OYxMSaiLc7km1ZJgHDlPT6-Qg';

const supabase = createClient(supabaseUrl,supabaseKey);


export default supabase;
