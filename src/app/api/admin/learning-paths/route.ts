import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { learningPaths, learningPathModules } from '@/db/schema'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !hasPermission(session.user.role as UserRole, 'create:paths' as Permission)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      title, 
      description, 
      difficulty, 
      estimatedTime, 
      prerequisites, 
      isSequential, 
      status, 
      certificateId,
      modules 
    } = await req.json()

    // Validation
    if (!title || !description || !difficulty || !modules || !Array.isArray(modules)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Transaction to create path and its module links
    const result = await db.transaction(async (tx) => {
      // 1. Insert Learning Path
      const [pathInsert] = await tx.insert(learningPaths).values({
        title,
        description,
        difficulty,
        estimatedTime: estimatedTime || null,
        prerequisites: prerequisites || null,
        isSequential: !!isSequential,
        status: status || 'draft',
        authorId: session.user.id,
        certificateId: certificateId || null,
      })

      const pathId = pathInsert.insertId

      // 2. Insert Module Links
      if (modules.length > 0) {
        await tx.insert(learningPathModules).values(
          modules.map((m: { moduleId: number; sortOrder: number }) => ({
            learningPathId: pathId,
            moduleId: m.moduleId,
            sortOrder: m.sortOrder,
          }))
        )
      }

      return { id: pathId }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating learning path:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/admin/learning-paths - Fetch all paths
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !hasPermission(session.user.role as UserRole, 'access:admin:dashboard' as Permission)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allPaths = await db.query.learningPaths.findMany({
      with: {
        modules: {
          with: {
            module: true
          }
        },
        author: true
      },
      orderBy: (paths, { desc }) => [desc(paths.createdAt)]
    })

    return NextResponse.json(allPaths)
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
