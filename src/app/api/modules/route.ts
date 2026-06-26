import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { modules } from '@/db/schema'
import { eq, desc, like, or, and } from 'drizzle-orm'
import type { ModuleDifficulty, ModuleCategory } from '@/types/module'

// GET /api/modules - Fetch all published modules with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')

    let query = db.select({
      id: modules.id,
      title: modules.title,
      description: modules.description,
      difficulty: modules.difficulty,
      category: modules.category,
      status: modules.status,
      authorId: modules.authorId,
      estimatedTime: modules.estimatedTime,
      participants: modules.participants,
      avgScore: modules.avgScore,
      views: modules.views,
      rating: modules.rating,
      badges: modules.badges,
      color: modules.color,
      accentColor: modules.accentColor,
      createdAt: modules.createdAt,
      updatedAt: modules.updatedAt,
    })
      .from(modules)
      .where(eq(modules.status, 'published'))

    const conditions = []

    if (category && category !== 'All') {
      conditions.push(eq(modules.category, category as ModuleCategory))
    }

    if (difficulty && difficulty !== 'All') {
      conditions.push(eq(modules.difficulty, difficulty as ModuleDifficulty))
    }

    if (search) {
      conditions.push(
        or(
          like(modules.title, `%${search}%`),
          like(modules.description, `%${search}%`)
        )
      )
    }

    if (conditions.length > 0) {
      // @ts-ignore - Drizzle ORM typing issue
      query = query.where(and(...conditions))
    }

    query = query.orderBy(desc(modules.createdAt))

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const allModules = await query

    return NextResponse.json(allModules)
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
