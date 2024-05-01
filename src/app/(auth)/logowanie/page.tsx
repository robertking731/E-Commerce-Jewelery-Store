import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { SignInWithPasswordForm } from "@/components/forms/auth/signin-with-password-form"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Logowanie",
  description: "Zaloguj się aby wygodniej zamawiać i śledzić zamówienia",
}

export default async function SignInPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session) redirect(DEFAULT_SIGNIN_REDIRECT)

  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center">
      <Card className="bg-background max-sm:flex  max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Logowanie</CardTitle>
            <Link href="/">
              <Icons.close className="size-4" />
            </Link>
          </div>
          <CardDescription>
            Zaloguj się i odkryj pełnię korzyści
          </CardDescription>
        </CardHeader>
        <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-10">
          <OAuthButtons />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
              <span className="bg-background px-3 font-medium tracking-tight">
                Lub kontynuuj z hasłem
              </span>
            </div>
          </div>
          <SignInWithPasswordForm />
        </CardContent>

        <CardFooter className="grid w-full text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-10">
          <div>
            <span>Nie posiadasz konta? </span>
            <Link
              aria-label="Rejestracja"
              href="/rejestracja"
              className="font-bold tracking-wide text-primary underline-offset-4 transition-colors hover:underline"
            >
              Załóż konto
              <span className="sr-only">Załóż konto</span>
            </Link>
            .
          </div>
          <div>
            <span>Zapomniałeś hasła? </span>
            <Link
              aria-label="Resetowanie hasła"
              href="/logowanie/haslo-reset"
              className="text-sm font-normal text-primary underline-offset-4 transition-colors hover:underline"
            >
              Zresetuj hasło
              <span className="sr-only">Zresetuj hasło</span>
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
