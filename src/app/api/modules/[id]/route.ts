import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { modules, moduleCards, questions, questionOptions } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const moduleId = parseInt(id)

    if (isNaN(moduleId)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 })
    }

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
