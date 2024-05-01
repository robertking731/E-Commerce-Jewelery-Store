import * as React from "react"

import { Footer } from "@/components/nav/store-front/footer"
import { Header } from "@/components/nav/store-front/header"

interface StoreFrontLayoutProps {
  children: React.ReactNode
}

export default function StoreFrontLayout({
  children,
}: Readonly<StoreFrontLayoutProps>): JSX.Element {
  return (
    <div>
      <div className="relative mx-auto flex size-full h-auto min-h-[85.5vh] max-w-7xl flex-col">
        <Header />
        <main className="flex-1 px-8">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
