"use client"

import * as React from "react"
import { signIn } from "next-auth/react"

import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function OAuthButtons(): JSX.Element {
  const { toast } = useToast()

  async function handleOAuthSignIn(
    provider: "google" | "facebook"
  ): Promise<void> {
    try {
      await signIn(provider, {
        callbackUrl: DEFAULT_SIGNIN_REDIRECT,
      })

      toast({
        title: "Witaj!",
        description: "Jesteś zalogowany",
      })
    } catch (error) {
      toast({
        title: "Coś poszło nie tak",
        description: "Spróbuj ponownie",
        variant: "destructive",
      })

      console.error(error)
      throw new Error(`Error signing in with ${provider}`)
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        aria-label="Sign in with Google"
        variant="outline"
        onClick={() => void handleOAuthSignIn("google")}
        className="w-full sm:w-auto"
      >
        <Icons.google className="mr-2 size-4" />
        Google
      </Button>

      <Button
        aria-label="Sign in with gitHub"
        variant="outline"
        onClick={() => void handleOAuthSignIn("facebook")}
        className="w-full sm:w-auto"
      >
        <Icons.facebook className="mr-2 size-4" />
        Facebook
      </Button>
    </div>
  )
}
