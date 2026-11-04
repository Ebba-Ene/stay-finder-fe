import BookingFormClient from "@/components/Bookings/BookingFormClient"
import { getPropertyById } from "@/utils/propertyService"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

type BookPropertyPageProps = PageProps<"/properties/[id]/book_stay">
type BookPropertyContentProps = Pick<BookPropertyPageProps, "params">

export default function BookPropertyPage({
  params,
}: BookPropertyPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
          <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-slate-100" />
        </main>
      }
    >
      <BookPropertyPageContent params={params} />
    </Suspense>
  )
}

async function BookPropertyPageContent({
  params,
}: BookPropertyContentProps) {
  const { id } = await params
  const property = await getPropertyById(id)

  if (!property) {
    notFound()
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <Link
        href={`/properties/${property.property_id}`}
        className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
      >
        Back to property
      </Link>

      <header>
        <p className="text-sm font-medium text-slate-500">
          Booking {property.title}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Reserve your stay
        </h1>
      </header>

      <BookingFormClient property={property} />
    </main>
  )
}
