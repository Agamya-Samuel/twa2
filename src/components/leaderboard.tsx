'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trophy, Medal, Flame, Target, Award, TrendingUp } from 'lucide-react'

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Alex Chen', points: 15420, badges: 47, modules: 28, streak: 24, avatar: '👤' },
  { rank: 2, name: 'Sarah Johnson', points: 14890, badges: 45, modules: 26, streak: 18, avatar: '👤' },
  { rank: 3, name: 'Marcus Williams', points: 13650, badges: 42, modules: 24, streak: 15, avatar: '👤' },
  { rank: 4, name: 'Emma Davis', points: 12340, badges: 38, modules: 21, streak: 12, avatar: '👤' },
  { rank: 5, name: 'James Wilson', points: 11980, badges: 36, modules: 20, streak: 10, avatar: '👤' },
  { rank: 6, name: 'Olivia Brown', points: 11450, badges: 34, modules: 19, streak: 8, avatar: '👤' },
  { rank: 7, name: 'David Martinez', points: 10890, badges: 31, modules: 17, streak: 7, avatar: '👤' },
  { rank: 8, name: 'Sophia Anderson', points: 10340, badges: 29, modules: 15, streak: 5, avatar: '👤' },
  { rank: 9, name: 'Noah Taylor', points: 9870, badges: 27, modules: 14, streak: 4, avatar: '👤' },
  { rank: 10, name: 'Ava Rodriguez', points: 9450, badges: 25, modules: 13, streak: 3, avatar: '👤' },
]

const FRIENDS_DATA = [
  { rank: 1, name: 'You', points: 8920, badges: 23, modules: 12, streak: 6, isYou: true, avatar: '👤' },
  { rank: 2, name: 'Mike Johnson', points: 7650, badges: 19, modules: 10, streak: 4, avatar: '👤' },
  { rank: 3, name: 'Lisa Chen', points: 6540, badges: 17, modules: 8, streak: 2, avatar: '👤' },
]

type LeaderboardTab = 'global' | 'friends' | 'weekly' | 'achievements'

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global')
  const [timeframe, setTimeframe] = useState('all-time')

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-slate-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />
      default:
        return <span className="text-sm font-bold text-foreground/60">#{rank}</span>
    }
  }

  return (
    <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 space-y-4">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboards
          </h1>
          <p className="text-lg text-foreground/60">
            Compete, earn badges, and climb the ranks. See how you stack up against other learners.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LeaderboardTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Global Leaderboard */}
          <TabsContent value="global" className="space-y-4">
            {/* Filter */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-foreground/60">Top learners all time</p>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Leaderboard Table */}
            <div className="space-y-2">
              {LEADERBOARD_DATA.map((user) => (
                <Card key={user.rank} className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      {/* Rank & Name */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                          {getRankIcon(user.rank)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-foreground/60">{user.points.toLocaleString()} points</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-secondary" />
                          <span>{user.badges} badges</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-accent" />
                          <span>{user.modules} modules</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="w-12 text-right">{user.streak} days</span>
                        </div>
                      </div>

                      {/* Points Badge */}
                      <div className="rounded-lg bg-primary/10 px-4 py-2 text-right flex-shrink-0">
                        <p className="text-lg font-bold text-primary">{(user.points / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-foreground/60">points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Friends Leaderboard */}
          <TabsContent value="friends" className="space-y-4">
            <div className="mb-6">
              <p className="text-sm text-foreground/60">Your friend standings</p>
            </div>

            <div className="space-y-2">
              {FRIENDS_DATA.map((user) => (
                <Card key={user.rank} className={`overflow-hidden transition-all ${
                  user.isYou ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                          {getRankIcon(user.rank)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate">
                            {user.name} {user.isYou && <span className="text-sm text-primary ml-1">(You)</span>}
                          </p>
                          <p className="text-xs text-foreground/60">{user.points.toLocaleString()} points</p>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-secondary" />
                          <span>{user.badges} badges</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-accent" />
                          <span>{user.modules} modules</span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-primary/10 px-4 py-2 text-right flex-shrink-0">
                        <p className="text-lg font-bold text-primary">{(user.points / 1000).toFixed(1)}K</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6">
              Invite More Friends
            </Button>
          </TabsContent>

          {/* Weekly Leaderboard */}
          <TabsContent value="weekly" className="space-y-4">
            <div className="mb-6">
              <p className="text-sm text-foreground/60">This week&apos;s top learners</p>
            </div>

            <div className="space-y-2">
              {LEADERBOARD_DATA.slice(0, 5).map((user) => (
                <Card key={user.rank} className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 flex-shrink-0">
                          {getRankIcon(user.rank)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate">{user.name}</p>
                          <div className="flex items-center gap-2 text-xs text-foreground/60">
                            <TrendingUp className="h-3 w-3 text-secondary" />
                            {Math.floor(Math.random() * 500) + 100} points this week
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-secondary/10 px-4 py-2 text-right flex-shrink-0">
                        <p className="text-lg font-bold text-secondary">+{Math.floor(Math.random() * 500) + 100}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="mb-6">
              <p className="text-sm text-foreground/60">Community achievement leaderboards</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                { title: 'Most Badges Earned', leader: 'Alex Chen', count: 47, icon: '🏅' },
                { title: 'Most Modules Completed', leader: 'Sarah Johnson', count: 28, icon: '📚' },
                { title: 'Longest Streak', leader: 'Emma Davis', count: 24, icon: '🔥' },
                { title: 'Most Quiz Correct', leader: 'Marcus Williams', count: 432, icon: '✅' },
              ].map((achievement, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="text-3xl">{achievement.icon}</span>
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-foreground/60">Leading learner:</p>
                    <p className="text-lg font-bold">{achievement.leader}</p>
                    <p className="text-3xl font-bold text-primary mt-4">{achievement.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
