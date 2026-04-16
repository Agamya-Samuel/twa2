import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { modules, moduleCards, questions, questionOptions } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'
import type { UpdateModuleRequest } from '@/types/module'

// GET /api/admin/modules/[id] - Fetch a single module with cards and questions
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

    // Fetch module with cards
    const moduleData = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: {
        cards: {
          orderBy: moduleCards.sortOrder,
          with: {
            questions: {
              orderBy: questions.sortOrder,
              with: {
                options: {
                  orderBy: questionOptions.sortOrder,
                },
              },
            },
          },
        },
      },
    })

    if (!moduleData) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    return NextResponse.json(moduleData)
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/modules/[id] - Update a module
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const moduleId = parseInt(id)

    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 })
    }

    // Check if user has permission to edit this module
    const canEditAny = hasPermission(session.user.role as UserRole, 'edit:any:modules' as Permission)

    if (!canEditAny) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: UpdateModuleRequest = await req.json()

    // Validate updates
    if (body.difficulty && !['Beginner', 'Intermediate', 'Advanced'].includes(body.difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 })
    }

    if (body.category && !['History', 'Science', 'Art & Culture', 'General'].includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Update module
    await db.update(modules)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(modules.id, moduleId))

    // Fetch updated module
    const updatedModule = await db.select().from(modules).where(eq(modules.id, moduleId))

    if (updatedModule.length === 0) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    return NextResponse.json(updatedModule[0])
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/modules/[id] - Delete a module
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const moduleId = parseInt(id)

    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 })
    }

    // Check if user has permission to delete this module
    const canDeleteAny = hasPermission(session.user.role as UserRole, 'delete:any:modules' as Permission)

    if (!canDeleteAny) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete module (cascade will handle cards, questions, and options)
    await db.delete(modules).where(eq(modules.id, moduleId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
