import PropertyList from "@/components/Property/PropertyList";

export default function MyPropertiesPage() {
  return(
    <div className="flex min-h-screen flex-1 flex-col items-center bg-slate-50 font-sans">
      <main className="w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <PropertyList mode="mine"/>
      </main>
    </div>
  )
}