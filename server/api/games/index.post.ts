// server/api/games/index.post.ts

import { serverSupabaseServiceRole } from '#supabase/server'
import { require_admin } from '~~/server/utils/admin'
import type { Game } from '~/types/game'

export default defineEventHandler(async (event) => {
  require_admin(event)

  const body = await readBody(event) as Partial<Game>
  if (!body || !body.title || body.steam_id == null) {
    throw createError({ statusCode: 400, statusMessage: 'title and steam_id are required' })
  }

  const supabase = serverSupabaseServiceRole(event)
  const { data, error } = await supabase
    .from('games')
    .insert(body)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data as Game
})
