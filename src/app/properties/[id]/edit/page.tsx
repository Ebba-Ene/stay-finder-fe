"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import PropertyForm from "@/components/Property/PropertyForm"
import T from "@/components/typography"
import { editProperty, getPropertyById } from "@/utils/propertyService"
import type { Property } from "@/types/property"

export default function EditPropertyPage() {
  return (
    <Suspense fallback={<main className="px-6 py-10">Loading edit page...</main>}>
      <EditPropertyContent />
    </Suspense>
  )
}

function EditPropertyContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProperty() {
      const result = await getPropertyById(id)
      setProperty(result)
      setLoading(false)
    }

    void loadProperty()
  }, [id])

  async function onEdit(formData: FormData) {
    const result = await editProperty(formData, id)

    if (!result.error) {
      router.push(`/properties/${id}`)
    }

    return result
  }

  if (loading) {
    return <main className="px-6 py-10">Loading property...</main>
  }

  if (!property) {
    return <main className="px-6 py-10">Property not found.</main>
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">Edit your stay</T.Header>

      <PropertyForm
        values={{
          title: property.title,
          description: property.description,
          city: property.city,
          country: property.country,
          kind_of_property: property.kind_of_property ?? "",
          max_guests: property.max_guests,
          price_per_night: property.price_per_night,
          image_url: property.image_url ?? "",
        }}
        action={onEdit}
        submitLabel="Save changes"
        pendingLabel="Saving..."
      />
    </main>
  )
}