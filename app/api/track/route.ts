import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(request: NextRequest) {
  const { page } = await request.json()
  if (!page) return new Response(null, { status: 204 })

  await supabase.from('page_views').insert({ page })

  return new Response(null, { status: 204 })
}
