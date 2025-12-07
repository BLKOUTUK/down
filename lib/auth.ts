import { createClient } from './supabase-browser';
import bcrypt from 'bcryptjs';

const supabase = createClient();

export async function signUp(email: string, password: string, name: string) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user in our users table
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password: hashedPassword,
      name,
      role: 'MEMBER',
      application_status: 'PENDING'
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  // Get user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    
  if (error || !user) {
    throw new Error('Invalid email or password');
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }
  
  // Update last active
  await supabase
    .from('users')
    .update({ last_active: new Date().toISOString() })
    .eq('id', user.id);
  
  return user;
}

export async function getCurrentUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      cohort:cohorts(*),
      media(*)
    `)
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
