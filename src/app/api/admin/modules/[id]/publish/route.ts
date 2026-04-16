import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { modules } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'
import type { PublishModuleRequest } from '@/types/module'

// POST /api/admin/modules/[id]/publish - Publish a module
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

    // Publishing requires edit permissions
    const canEditAny = hasPermission(session.user.role as UserRole, 'edit:any:modules' as Permission)

    if (!canEditAny) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const moduleId = parseInt(id)

    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 })
    }

    const body: PublishModuleRequest = await req.json()

    if (body.status !== 'published') {
      return NextResponse.json({ error: 'Invalid publish status' }, { status: 400 })
    }

    // Update module status
    await db.update(modules)
      .set({
        status: 'published',
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
    console.error('Error publishing module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
