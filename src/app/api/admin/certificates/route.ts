import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { certificates } from '@/db/schema'
import { authOptions } from '@/lib/auth'
import { hasPermission, UserRole, Permission } from '@/lib/roles'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !hasPermission(session.user.role as UserRole, 'manage:certificates' as Permission)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, image } = await req.json()

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing title or description' }, { status: 400 })
    }

    const [result] = await db.insert(certificates).values({
      title,
      description,
      image: image || null,
    })

    return NextResponse.json({ id: result.insertId, title, description }, { status: 201 })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
