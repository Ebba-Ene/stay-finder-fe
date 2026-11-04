import Link from "next/link"

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Stay was not found</h1>
      <p className="mt-4 text-slate-600">
        The Stay could have been removed or this is a wrong link.
      </p>
      <Link href="/" className="mt-6 inline-block text-blue-700 hover:underline">
        Back to Stay List
      </Link>
    </main>
  )
}