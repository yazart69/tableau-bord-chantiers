import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// On vérifie si les clés existent avant de créer le client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Attention : Les clés Supabase sont manquantes dans les variables d'environnement !");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', // Évite le crash si vide
  supabaseAnonKey || 'placeholder'
)
