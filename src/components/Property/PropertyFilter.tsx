"use client"

import { useState, type SubmitEvent } from "react"
import type { PropertiesFilter } from "@/utils/propertyService"
import type { PropertyKind } from "@/types/property"

type PropertyFilterProps = {
  loading: boolean
  onFilter: (filters: PropertiesFilter) => void | Promise<void>
}

export default function PropertyFilter({
  loading,
  onFilter,
}: PropertyFilterProps) {
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [maxGuests, setMaxGuests] = useState("")
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | "">("")
  const [kind, setKind] = useState<PropertyKind | "">("")

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    await onFilter({
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      maxGuests: maxGuests ? Number(maxGuests) : undefined,
      kind: kind || undefined,
      sortPrice: sortPrice || undefined,
    })
  }

  function handleReset() {
    setCity("")
    setCountry("")
    setMaxPrice("")
    setMaxGuests("")
    setKind("")
    setSortPrice("")
    void onFilter({})
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Find your stay</h2>
        <p className="mt-1 text-sm text-slate-500">
          Narrow down the results by type, location, price, or guest capacity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div>
          <label htmlFor="property-kind" className="mb-1.5 block text-sm font-medium text-slate-700">
            Property type
          </label>
          <select
            id="property-kind"
            name="kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as PropertyKind | "")}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
          </select>
        </div>
        <div>
          <label htmlFor="property-city" className="mb-1.5 block text-sm font-medium text-slate-700">
            City
          </label>
          <input
            id="property-city"
            name="city"
            placeholder="e.g. Stockholm"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="property-country" className="mb-1.5 block text-sm font-medium text-slate-700">
            Country
          </label>
          <input
            id="property-country"
            name="country"
            placeholder="e.g. Sweden"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="property-max-price" className="mb-1.5 block text-sm font-medium text-slate-700">
            Max price per night
          </label>
          <input
            id="property-max-price"
            name="maxPrice"
            type="number"
            min="1"
            placeholder="Any price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="property-sort-price" className="mb-1.5 block text-sm font-medium text-slate-700">
            Sort by price
          </label>
          <select
            id="property-sort-price"
            name="sortPrice"
            value={sortPrice}
            onChange={(event) =>
              setSortPrice(event.target.value as "asc" | "desc" | "")
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Default order</option>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
          </select>
        </div>
        <div>
          <label htmlFor="property-max-guests" className="mb-1.5 block text-sm font-medium text-slate-700">
            Max guests
          </label>
          <input
            id="property-max-guests"
            name="maxGuests"
            type="number"
            min="1"
            placeholder="Any size"
            value={maxGuests}
            onChange={(event) => setMaxGuests(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Clear filters
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search stays"}
        </button>
      </div>
    </form>
  )
}
