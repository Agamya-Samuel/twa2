import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { modules } from '@/db/schema'
import { eq, desc, like, or } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'
import type { ModuleDifficulty, ModuleCategory, ModuleStatus, CreateModuleRequest, ModuleFilters } from '@/types/module'

// GET /api/admin/modules - Fetch all modules with optional filtering
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !hasPermission(session.user.role as UserRole, 'access:admin:dashboard' as Permission)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')

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

    // Apply filters
    const conditions = []

    if (status && status !== 'all') {
      conditions.push(eq(modules.status, status as ModuleStatus))
    }

    if (category) {
      conditions.push(eq(modules.category, category as ModuleCategory))
    }

    if (difficulty) {
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
      query = query.where(...conditions)
    }

    const allModules = await query.orderBy(desc(modules.createdAt))

    return NextResponse.json(allModules)
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/modules - Create a new module
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !hasPermission(session.user.role as UserRole, 'create:modules' as Permission)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateModuleRequest = await req.json()
    const { title, description, difficulty, category, estimatedTime, color, accentColor, status = 'published' } = body

    // Validation
    if (!title || !description || !difficulty || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 })
    }

    if (!['History', 'Science', 'Art & Culture', 'General'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Create module
    const result = await db.insert(modules).values({
      title,
      description,
      difficulty,
      category,
      status,
      authorId: session.user.id,
      estimatedTime: estimatedTime || '30 min',
      participants: 0,
      avgScore: 0,
      views: 0,
      rating: 5,
      badges: 0,
      color: color || '#3b82f6',
      accentColor: accentColor || '#1d4ed8',
    })

    // Fetch the created module
    const createdModule = await db.select().from(modules).where(eq(modules.id, Number(result[0].insertId)))

    if (createdModule.length === 0) {
      return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
    }

    return NextResponse.json(createdModule[0], { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
