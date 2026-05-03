'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Award,
  BookOpen,
  Mail,
  Edit2,
  Share2,
  CheckCircle2,
  Flame,
  TrendingUp,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useSession } from 'next-auth/react'

export function UserProfile() {
  const { data: session } = useSession()
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setProfileData(data)
        }
      } catch (err) {
        console.error('Failed to fetch profile', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // HELPER: Merge duplicate achievements (e.g. from modules vs paths)
  const getMergedAchievements = (rawAchievements: any[]) => {
    const mergedMap = new Map()
    rawAchievements?.forEach((ua: any) => {
      const ach = ua.achievement
      if (!ach) return
      
      if (mergedMap.has(ach.name)) {
        const existing = mergedMap.get(ach.name)
        // Only append if description is different
        if (!existing.description.includes(ach.description)) {
           existing.description = `${existing.description}, ${ach.description}`
        }
      } else {
        mergedMap.set(ach.name, { ...ach, unlocked: true })
      }
    })
    return Array.from(mergedMap.values())
  }

  const mergedAchievements = getMergedAchievements(profileData?.achievements || [])
  const userData = profileData?.user
  const stats = profileData?.stats
  const certificates = profileData?.certificates || []

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const displayName = userData?.name || session?.user?.name || 'Explorer'

  return (
    <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Profile Header */}
        <div className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-foreground shadow-inner">
                  {userData?.image ? (
                    <img src={userData.image} className="h-full w-full rounded-full object-cover" alt="" />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">{displayName}</h1>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                      {userData?.role || 'User'}
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-foreground/60">
                    <Mail className="h-4 w-4" />
                    {userData?.email || session?.user?.email}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    Member since {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-foreground/70 max-w-7xl leading-relaxed">
                {userData?.bio || 'Wikipedia active editor committed to open knowledge and educational excellence.'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-5">
            <div className="rounded-xl border border-border bg-background/50 p-4 transition-all hover:border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground/60 uppercase">Points</span>
              </div>
              <p className="text-2xl font-black text-primary">{(userData?.points || 0).toLocaleString()}</p>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-4 transition-all hover:border-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-secondary" />
                <span className="text-xs font-semibold text-foreground/60 uppercase">Achievements</span>
              </div>
              <p className="text-2xl font-black text-secondary">{mergedAchievements.length}</p>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-4 transition-all hover:border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-foreground/60 uppercase">Modules</span>
              </div>
              <p className="text-2xl font-black text-accent">{stats?.modulesCompleted || 0}</p>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-semibold text-foreground/60 uppercase">Streak</span>
              </div>
              <p className="text-2xl font-black text-orange-500">{userData?.currentStreak || 0}</p>
              <p className="text-[10px] text-foreground/40 font-bold uppercase">Days</p>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-4">
              <div className="flex items-center gap-2 mb-2 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-semibold text-foreground/60 uppercase">Best</span>
              </div>
              <p className="text-2xl font-black text-green-500">{userData?.longestStreak || 0}</p>
              <p className="text-[10px] text-foreground/40 font-bold uppercase">Days</p>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <Tabs defaultValue="achievements" className="w-full space-y-8">
          <TabsList className="bg-muted/50 p-1 rounded-xl w-full max-w-7xl mx-auto grid grid-cols-3">
            <TabsTrigger value="achievements" className="rounded-lg py-2.5">Achievements</TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-lg py-2.5">Certificates</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg py-2.5">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mergedAchievements.length > 0 ? (
                mergedAchievements.map((ach: any) => (
                  <Card key={ach.id} className="overflow-hidden border-2 border-transparent hover:border-secondary/20 transition-all bg-card/50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-4xl shadow-sm border border-secondary/20">
                          {ach.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground text-lg mb-1">{ach.name}</h4>
                          <p className="text-sm text-foreground/60 leading-snug line-clamp-3 italic">
                             "{ach.description}"
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-foreground/40 font-medium">No achievements yet. Start learning to earn badges!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid gap-6 md:grid-cols-2">
                {certificates.map((uc: any) => (
                  <Card key={uc.id} className="group overflow-hidden border-2 border-primary/10 hover:border-primary/40 transition-all cursor-pointer bg-card/40 backdrop-blur-sm">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      <div className="p-6 flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                             <ShieldCheck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl">{uc.certificate.title}</h4>
                            <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Verified Achievement</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/70 leading-relaxed">{uc.certificate.description}</p>
                        <div className="flex items-center gap-4 pt-2">
                           <Button size="sm" className="font-bold bg-primary text-primary-foreground transform group-hover:scale-105 transition-transform">
                             Download PDF
                           </Button>
                           <p className="text-[10px] text-foreground/40 italic">Awarded on {new Date(uc.awardedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="bg-primary/5 p-6 flex items-center justify-center sm:border-l border-primary/10">
                         <div className="text-6xl opacity-40 grayscale group-hover:grayscale-0 transition-all transform group-hover:rotate-12">🎖️</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {certificates.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                    <p className="text-foreground/40">Complete a Learning Path to earn verified certificates.</p>
                  </div>
                )}
             </div>
          </TabsContent>

          <TabsContent value="activity">
             <div className="rounded-3xl border-2 border-dashed border-border py-20 text-center bg-card/20">
               <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-10" />
               <p className="text-foreground/40">Historical activity log arriving soon.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
