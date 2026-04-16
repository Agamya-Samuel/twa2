import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { moduleCards, questions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'
import type { UpdateCardRequest } from '@/types/module'

// PATCH /api/admin/modules/[id]/cards/[cardId] - Update a card
export async function PATCH(
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

    const body: UpdateCardRequest = await req.json()

    // Update card
    await db.update(moduleCards)
      .set(body)
      .where(eq(moduleCards.id, cardId))

    // Fetch updated card
    const updatedCard = await db.select().from(moduleCards).where(eq(moduleCards.id, cardId))

    if (updatedCard.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCard[0])
  } catch (error) {
    console.error('Error updating card:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/modules/[id]/cards/[cardId] - Delete a card
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, cardId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const canDeleteAny = hasPermission(session.user.role as UserRole, 'delete:any:modules' as Permission)

    if (!canDeleteAny) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const cardId = parseInt(resolvedParams.cardId)

    if (isNaN(cardId)) {
      return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 })
    }

    await db.delete(moduleCards).where(eq(moduleCards.id, cardId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting card:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
