
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evxfyrdxzbknourowgqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eGZ5cmR4emJrbm91cm93Z3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTU4ODQsImV4cCI6MjA4MjUzMTg4NH0.0ty6yitP0aSXRXHJtsGctQrbAQjQXHLaZd6yeuliKMk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
