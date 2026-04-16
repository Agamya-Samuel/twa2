import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { learningPaths } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pathId = parseInt(id)

    if (isNaN(pathId)) {
      return NextResponse.json({ error: 'Invalid path ID' }, { status: 400 })
    }

    const path = await db.query.learningPaths.findFirst({
      where: eq(learningPaths.id, pathId),
      with: {
        modules: {
          orderBy: (lpm, { asc }) => [asc(lpm.sortOrder)],
          with: {
            module: {
              columns: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                estimatedTime: true,
                category: true,
                color: true,
                accentColor: true,
              }
            }
          }
        },
        author: {
          columns: {
            name: true,
            image: true,
          }
        }
      }
    })

    if (!path) {
      return NextResponse.json({ error: 'Learning path not found' }, { status: 404 })
    }

    return NextResponse.json(path)
  } catch (error) {
    console.error('Error fetching learning path:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
