import PropertyDetails from "@/components/Property/PropertyDetails";
import { getPropertyById } from "@/utils/propertyService";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PropertyPageProps = PageProps<"/properties/[id]">
type PropertyDetailsProps = Pick<PropertyPageProps, "params">

export default function PropertyPage({ params }: PropertyPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="space-y-3">
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
            <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="h-24 animate-pulse rounded-xl bg-zinc-100" />
        </main>
      }
    >
      <PropertyPageContent params={params} />
    </Suspense>
  )
}

async function PropertyPageContent({ params }: PropertyDetailsProps) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <PropertyDetails property={property} mode="detail" />
    </main>
  );
}