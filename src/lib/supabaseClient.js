import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://qyuztrbgxvdbitufqpoz.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dXp0cmJneHZkYml0dWZxcG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzU1MzUsImV4cCI6MjA2NTcxMTUzNX0.5jrpGJZ-xMs3IAxv1j0v9MZUQTXl83hNIwUMerobRFw";

export const supabase = createClient(supabaseUrl, supabaseKey);