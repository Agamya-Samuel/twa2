import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { moduleCards } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'
import type { CreateCardRequest } from '@/types/module'

// GET /api/admin/modules/[id]/cards - Fetch all cards for a module
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session || !hasPermission(session.user.role as UserRole, 'access:admin:dashboard' as Permission)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const moduleId = parseInt(id)

    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 })
    }

    const cards = await db.query.moduleCards.findMany({
      where: eq(moduleCards.moduleId, moduleId),
      orderBy: moduleCards.sortOrder,
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/modules/[id]/cards - Add new card to a module
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to edit this module
    const canEditAny = hasPermission(session.user.role as UserRole, 'edit:any:modules' as Permission)

    if (!canEditAny) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const moduleId = parseInt(id)

    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 })
    }

    const body: CreateCardRequest = await req.json()

    // Validate request
    if (!body.title || !body.type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 })
    }

    if (!['content', 'question', 'achievement'].includes(body.type)) {
      return NextResponse.json({ error: 'Invalid card type' }, { status: 400 })
    }

    // Insert card
    const result = await db.insert(moduleCards).values({
      moduleId,
      type: body.type,
      title: body.title,
      content: body.content,
      icon: body.icon,
      image: body.image,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
    })

    const createdCard = await db.select().from(moduleCards).where(eq(moduleCards.id, Number(result[0].insertId)))

    if (createdCard.length === 0) {
      return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
    }

    return NextResponse.json(createdCard[0], { status: 201 })
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
