// server/api/games/[id]/index.delete.ts

import { serverSupabaseServiceRole } from '#supabase/server'
import { require_admin } from '~~/server/utils/admin'

export default defineEventHandler(async (event) => {
  require_admin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const supabase = serverSupabaseServiceRole(event)
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true }
})
