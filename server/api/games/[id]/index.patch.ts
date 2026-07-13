// server/api/games/[id]/index.patch.ts

import { serverSupabaseServiceRole } from '#supabase/server'
import { require_admin } from '~~/server/utils/admin'
import type { Game } from '~/types/game'

export default defineEventHandler(async (event) => {
  require_admin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const body = await readBody(event) as Partial<Game>
  if (!body || Object.keys(body).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Empty body' })
  }

  const supabase = serverSupabaseServiceRole(event)
  const { data, error } = await supabase
    .from('games')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data as Game
})
