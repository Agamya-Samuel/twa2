import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/db'
import { 
  userModuleProgress, 
  userLearningPathModuleProgress, 
  userLearningPathProgress,
  learningPaths,
  learningPathModules,
  userCertificates
} from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { moduleId, status, currentCardIndex, pathId } = await req.json()

    if (!moduleId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const userId = session.user.id

    if (pathId) {
      // HANDLE LEARNING PATH PROGRESS
      const pathId_num = parseInt(pathId)
      
      // 1. Upsert Module Progress within Path
      await db.insert(userLearningPathModuleProgress)
        .values({
          userId,
          learningPathId: pathId_num,
          moduleId: parseInt(moduleId),
          status,
          currentCardIndex: currentCardIndex || 0,
          completedAt: status === 'completed' ? new Date() : null,
          updatedAt: new Date(),
        })
        .onDuplicateKeyUpdate({
          set: {
            status,
            currentCardIndex: currentCardIndex || 0,
            completedAt: status === 'completed' ? new Date() : null,
            updatedAt: new Date(),
          }
        })

      // 2. Ensure Path entry exists
      const existingPathProgress = await db.query.userLearningPathProgress.findFirst({
        where: and(
          eq(userLearningPathProgress.userId, userId),
          eq(userLearningPathProgress.learningPathId, pathId_num)
        )
      })

      if (!existingPathProgress) {
        await db.insert(userLearningPathProgress).values({
          userId,
          learningPathId: pathId_num,
          status: 'in_progress',
        })
      }

      // 3. If module completed, check for path completion
      if (status === 'completed') {
        const pathData = await db.query.learningPaths.findFirst({
          where: eq(learningPaths.id, pathId_num),
          with: {
            modules: true
          }
        })

        if (pathData) {
          const totalModules = pathData.modules.length
          
          const completedCountResult = await db.select({ value: count() })
            .from(userLearningPathModuleProgress)
            .where(and(
              eq(userLearningPathModuleProgress.userId, userId),
              eq(userLearningPathModuleProgress.learningPathId, pathId_num),
              eq(userLearningPathModuleProgress.status, 'completed')
            ))

          const completedCount = completedCountResult[0].value

          if (completedCount >= totalModules) {
            // Path Completed!
            await db.update(userLearningPathProgress)
              .set({
                status: 'completed',
                completedAt: new Date(),
                updatedAt: new Date()
              })
              .where(and(
                eq(userLearningPathProgress.userId, userId),
                eq(userLearningPathProgress.learningPathId, pathId_num)
              ))

            // Award Certificate if exists
            if (pathData.certificateId) {
              const existingCert = await db.query.userCertificates.findFirst({
                where: and(
                  eq(userCertificates.userId, userId),
                  eq(userCertificates.certificateId, pathData.certificateId)
                )
              })

              if (!existingCert) {
                await db.insert(userCertificates).values({
                  userId,
                  certificateId: pathData.certificateId,
                })
              }
            }
            return NextResponse.json({ pathCompleted: true })
          }
        }
      }
    } else {
      // HANDLE STANDALONE MODULE PROGRESS
      await db.insert(userModuleProgress)
        .values({
          userId,
          moduleId: parseInt(moduleId),
          status,
          currentCardIndex: currentCardIndex || 0,
          completedAt: status === 'completed' ? new Date() : null,
          updatedAt: new Date(),
        })
        .onDuplicateKeyUpdate({
          set: {
            status,
            currentCardIndex: currentCardIndex || 0,
            completedAt: status === 'completed' ? new Date() : null,
            updatedAt: new Date(),
          }
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
