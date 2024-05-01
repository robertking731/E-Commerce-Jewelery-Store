import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAllCategories, getAllSubcategories } from "@/actions/category"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddProductForm } from "@/components/forms/inventory/product/add-product-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dodaj nowy produkt",
  description: "Dodaj nowy produkt do swojego asortymentu",
}

export default async function NewProductPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const categories = await getAllCategories()
  const subcategories = await getAllSubcategories()

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Dodaj nowy produkt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddProductForm
            categories={categories}
            subcategories={subcategories}
          />
        </CardContent>
      </Card>
    </div>
  )
}
