import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { getUserById } from "@/actions/user"
import { auth } from "@/auth"
import type { SearchParams } from "@/types"
import { endOfDay, startOfDay } from "date-fns"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { orders, type Order } from "@/db/schema"
import { customerSearchParamsSchema } from "@/validations/params"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Zamówienia klienta",
  description: "Zobacz i zarządzaj zamówieniami zamówienia",
}

interface AdminCustomerPage {
  params: {
    customerId: string
  }
  searchParams: SearchParams
}

export default async function AdminCustomerPage({
  params,
  searchParams,
}: AdminCustomerPage) {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const user = await getUserById({ id: params.customerId })
  if (!user) notFound()

  const { page, per_page, sort, status, from, to } =
    customerSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? startOfDay(new Date(from)) : undefined
  const toDay = to ? endOfDay(new Date(to)) : undefined

  const statuses = status ? status.split(".") : []

  const [column, order] = (sort?.split(".") as [
    keyof Order | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: orders.id,
      quantity: orders.quantity,
      amount: orders.amount,
      paymentIntentId: orders.stripePaymentIntentId,
      status: orders.stripePaymentIntentStatus,
      customer: orders.email,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        eq(orders.email, user.email),
        statuses.length > 0
          ? inArray(orders.stripePaymentIntentStatus, statuses)
          : undefined,
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined
      )
    )
    .orderBy(
      column && column in orders
        ? order === "asc"
          ? asc(orders[column])
          : desc(orders[column])
        : desc(orders.createdAt)
    )

  noStore()
  const count = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.email, user.email),
        statuses.length > 0
          ? inArray(orders.stripePaymentIntentStatus, statuses)
          : undefined,
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined
      )
    )
    .execute()
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      {data?.length === 0 ? (
        <Card className="flex h-[84vh] flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed bg-accent/40 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Brak zamówień klienta do wyświetlenia
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Wybrany klient nie posiada jeszcze historii zamówień
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="text-xl font-bold tracking-tight md:text-2xl">
                Zamówienia klienta
              </div>
              <DateRangePicker align="end" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
              <OrdersTableShell
                data={data}
                pageCount={pageCount}
                isSearchable={false}
              />
            </React.Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
