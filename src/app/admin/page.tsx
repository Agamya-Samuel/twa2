'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminModuleEditor } from '@/components/admin-module-editor'
import { AdminUserManager } from '@/components/admin-user-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, BookOpen } from 'lucide-react'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
        <Tabs defaultValue="modules" className="w-full">
          <TabsList>
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>
          <TabsContent value="modules">
            <AdminModuleEditor />
          </TabsContent>
          <TabsContent value="users">
            <AdminUserManager />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </main>
  )
}
