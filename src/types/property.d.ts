import { Database } from "./database.types"

export type PropertyKind = "apartment" | "villa"

export type Property = Database["public"]["Tables"]["properties"]["Row"]

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"]

export type NewProperty = Omit<
  PropertyInsert, "owner_id" | "property_id" | "created_at" | "kind_of_property"
> & {
  owner_id: string
  kind: PropertyKind
}

export type PropertyValidKey = keyof Property