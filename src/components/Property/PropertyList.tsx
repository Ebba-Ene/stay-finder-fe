import { getProperties } from "@/utils/propertyService";
import { PropertyCard } from "./PropertyCard";

export default async function PropertyList() {
  const properties = await getProperties()

  return(
    <div>
      [PROPERTIES]
      <div>
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property}/>
        ))}
      </div>
    </div>
  )
}