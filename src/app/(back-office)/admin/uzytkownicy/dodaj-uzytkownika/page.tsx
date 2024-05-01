import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddUserAsAdminForm } from "@/components/forms/user/add-user-as-admin-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dodaj nowego użytkownika",
  description: "Dodaj nowego użytkownika jako administrator",
}

export default async function AdminAddUserPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Dodaj nowego użytkownika
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddUserAsAdminForm />
        </CardContent>
      </Card>
    </div>
  )
}
