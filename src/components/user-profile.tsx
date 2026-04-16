'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Award,
  Target,
  Flame,
  BookOpen,
  Settings,
  Share2,
  Mail,
  Edit2,
  CheckCircle2,
  Star,
  TrendingUp,
} from 'lucide-react'

// Mock data removed - components will fetch from database
// TODO: Implement database query to fetch user profile data
const USER_DATA: any = {
  name: 'Jordan Smith',
  email: 'jordan.smith@example.com',
  joinDate: 'Joined March 2024',
  bio: 'Passionate about learning and sharing knowledge. Currently exploring history and science topics.',
  totalPoints: 8920,
  rank: 247,
  totalBadges: 23,
  modulesCompleted: 12,
  currentStreak: 6,
  longestStreak: 18,
  achievements: [],
  recentModules: [],
  friends: [],
}

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(USER_DATA.name)

  return (
    <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* User Info */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-foreground">
                  {USER_DATA.name.charAt(0)}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mb-2 rounded border border-border bg-background px-2 py-1 text-xl font-bold text-foreground"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{USER_DATA.name}</h1>
                  )}
                  <p className="flex items-center gap-2 text-sm text-foreground/60">
                    <Mail className="h-4 w-4" />
                    {USER_DATA.email}
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">{USER_DATA.joinDate}</p>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={USER_DATA.bio}
                  className="w-full rounded border border-border bg-background p-2 text-sm text-foreground"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-foreground/70">{USER_DATA.bio}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setEditName(USER_DATA.name)
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-foreground/60">Points</p>
              </div>
              <p className="text-2xl font-bold text-primary">{(USER_DATA.totalPoints / 1000).toFixed(1)}K</p>
              <p className="text-xs text-foreground/50 mt-1">Rank #{USER_DATA.rank}</p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-secondary" />
                <p className="text-xs font-medium text-foreground/60">Badges</p>
              </div>
              <p className="text-2xl font-bold text-secondary">{USER_DATA.totalBadges}</p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <p className="text-xs font-medium text-foreground/60">Modules</p>
              </div>
              <p className="text-2xl font-bold text-accent">{USER_DATA.modulesCompleted}</p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <p className="text-xs font-medium text-foreground/60">Streak</p>
              </div>
              <p className="text-2xl font-bold text-orange-500">{USER_DATA.currentStreak}</p>
              <p className="text-xs text-foreground/50 mt-1">days</p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="text-xs font-medium text-foreground/60">Best</p>
              </div>
              <p className="text-2xl font-bold text-green-500">{USER_DATA.longestStreak}</p>
              <p className="text-xs text-foreground/50 mt-1">days</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="space-y-4">
              {USER_DATA.achievements.map((achievement: any) => (
                <Card key={achievement.id} className={`overflow-hidden ${
                  achievement.unlocked ? 'border-secondary/30' : 'opacity-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10 text-3xl flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{achievement.name}</p>
                          {achievement.unlocked && (
                            <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-foreground/60">{achievement.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            {USER_DATA.recentModules.map((module: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">{module.title}</p>
                        {module.completed && (
                          <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-foreground/60">{module.date}</p>
                    </div>
                    {module.completed ? (
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-primary">{module.score}%</p>
                        <p className="text-xs text-foreground/60">Score</p>
                      </div>
                    ) : (
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-secondary">{module.progress}%</p>
                        <p className="text-xs text-foreground/60">Progress</p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <Progress value={module.completed ? 100 : module.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            {USER_DATA.friends.map((friend: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        {friend.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{friend.name}</p>
                        <p className="text-xs text-foreground/60">
                          {friend.status === 'online' ? '🟢 Online' : '⚪ Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">{(friend.points / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-foreground/60">points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full">
              + Add Friend
            </Button>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your learning preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Difficulty Level</label>
                  <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground">
                    <option>All Levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Preferred Categories</label>
                  <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground" multiple>
                    <option>History</option>
                    <option>Science</option>
                    <option>Art & Culture</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Email Notifications</label>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
