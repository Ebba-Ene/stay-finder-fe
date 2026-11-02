"use client"

import { useCallback, useEffect, useState } from "react"
import { getMyProperties, getProperties } from "@/utils/propertyService"
import type { PropertiesFilter } from "@/utils/propertyService"
import type { Property } from "@/types/property"
import { PropertyCard } from "./PropertyCard"
import PropertyFilter from "./PropertyFilter"
import PropertyDeleteButton from "./PropertyDeleteButton"

type PropertyListProps = {
  mode: "mine" | "all"
}

export default function PropertyList({mode}: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [message, setMessage] = useState("")

  const loadProperties = useCallback(
    async (filters: PropertiesFilter = {}) => {
      setLoading(true)
      setError("")

      try {
        if(mode === "all"){
          setProperties(await getProperties(filters))
        } else if(mode === "mine"){
          setProperties(await getMyProperties())
        }
      } catch {
        setError("Could not get properties.")
      } finally {
        setLoading(false)
      }
    },
    [mode]
  )

  useEffect(() => {
    void loadProperties()
  }, [loadProperties])

  return (
    <section className="w-full">
      {mode === "all" && (
        <PropertyFilter loading={loading} onFilter={loadProperties} />
      )}

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {mode==="all" ? "Places to stay" : "My Properties"}
          </h1>
          {!loading && !error && (
            <p className="mt-1 text-sm text-slate-500">
              {properties.length} {properties.length === 1 ? "stay" : "stays"} found
            </p>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-[4/3] animate-pulse bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No stays found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Try changing or clearing your filters.
          </p>
        </div>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property.property_id}>
            <PropertyCard property={property} />
            {mode === "mine" && (
              <div className="mt-3">
                <PropertyDeleteButton
                  propertyId={property.property_id}
                  ownerId={property.owner_id}
                  onDeleted={() => {
                    setProperties((current) =>
                      current.filter(
                        (item) => item.property_id !== property.property_id
                      )
                    )
                    setMessage("Boendet har raderats.")
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </section>
  )
}