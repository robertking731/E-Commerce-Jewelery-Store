"use server"

import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import { carts, products } from "@/db/schema"
import type { CartLineItem } from "@/validations/cart"

export async function getCart() {
  const cartId = cookies().get("cartId")?.value
  if (!cartId || isNaN(Number(cartId))) return []

  const cartLineItems = await db.query.carts.findFirst({
    columns: {
      items: true,
    },
    // where: eq(carts.id, Number(cartId)),
  })

  return cartLineItems
}

// TODO: Implement
export async function addToCart() {}
