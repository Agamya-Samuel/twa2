import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { questions, questionOptions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'
import type { CreateQuestionRequest } from '@/types/module'

// GET /api/admin/modules/[id]/cards/[cardId]/questions - Fetch all questions for a card
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, cardId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params

    if (!session || !hasPermission(session.user.role as UserRole, 'access:admin:dashboard' as Permission)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cardId = parseInt(resolvedParams.cardId)

    if (isNaN(cardId)) {
      return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 })
    }

    const cardQuestions = await db.query.questions.findMany({
      where: eq(questions.cardId, cardId),
      orderBy: questions.sortOrder,
      with: {
        options: {
          orderBy: questionOptions.sortOrder,
        },
      },
    })

    return NextResponse.json(cardQuestions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/modules/[id]/cards/[cardId]/questions - Add question to a card
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, cardId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const canEditAny = hasPermission(session.user.role as UserRole, 'edit:any:modules' as Permission)

    if (!canEditAny) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const cardId = parseInt(resolvedParams.cardId)

    if (isNaN(cardId)) {
      return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 })
    }

    const body: CreateQuestionRequest = await req.json()

    // Validate request
    if (!body.question || !body.type || !body.correctAnswer) {
      return NextResponse.json({ error: 'Question, type, and correct answer are required' }, { status: 400 })
    }

    if (!['multiple-choice', 'true-false', 'text'].includes(body.type)) {
      return NextResponse.json({ error: 'Invalid question type' }, { status: 400 })
    }

    const result = await db.insert(questions).values({
      cardId: cardId,
      question: body.question,
      type: body.type,
      correctAnswer: body.correctAnswer,
      explanation: body.explanation || '',
      hint: body.hint || null,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
    })

    const questionId = Number(result[0].insertId)

    // Insert options if available
    if (body.options && body.options.length > 0) {
      const optionsToInsert = body.options.map(opt => ({
        questionId,
        optionText: opt.optionText,
        sortOrder: typeof opt.sortOrder === 'number' ? opt.sortOrder : 0,
      }))

      await db.insert(questionOptions).values(optionsToInsert)
    }

    // Fetch created question with options
    const createdQuestion = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
      with: {
        options: {
          orderBy: questionOptions.sortOrder,
        },
      },
    })

    return NextResponse.json(createdQuestion, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
