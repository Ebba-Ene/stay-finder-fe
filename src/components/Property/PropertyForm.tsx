import { CreatePropertyState } from "@/utils/propertyService";
import { SubmitEvent, useState } from "react";

const fieldClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClassName = "flex flex-col gap-2 text-sm font-medium text-slate-700";


export type PropertyFormValues = {
  title?: string;
  description?: string;
  city?: string;
  country?: string;
  kind_of_property?: string;
  max_guests?: number;
  price_per_night?: number;
  image_url?: string;
}

type PropertyFormProps = {
  action: (formData: FormData) => Promise<CreatePropertyState>;
  values?: PropertyFormValues;
  submitLabel?: string;
  pendingLabel?: string;
};

export default function PropertyForm({
  action,
  values,
  submitLabel = "Create stay",
  pendingLabel = "Creating…",
}: PropertyFormProps) {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(undefined);
    setPending(true);
    try {
      const result = await action(formData);
      setError(result.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 sm:p-8"
    >
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Property details
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Add the details guests need to find and book your stay.
        </p>
      </div>

      <div className="space-y-5">
        <label className={labelClassName}>
          Title
          <input
            name="title"
            required
            defaultValue={values?.title}
            placeholder="e.g. Cozy apartment near the city"
            className={fieldClassName}
          />
        </label>

        <label className={labelClassName}>
          Description
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={values?.description}
            placeholder="Describe what makes your property special..."
            className={`${fieldClassName} resize-y`}
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            Location
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <label htmlFor="property-city" className={labelClassName}>
              City
              <input
                id="property-city"
                name="city"
                required
                defaultValue={values?.city}
                placeholder="City"
                className={fieldClassName}
              />
            </label>
            <label htmlFor="property-country" className={labelClassName}>
              Country
              <input
                id="property-country"
                name="country"
                required
                defaultValue={values?.country}
                placeholder="Country"
                className={fieldClassName}
              />
            </label>
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClassName}>
            Property type
            <select
              name="kind"
              required
              defaultValue={values?.kind_of_property ?? ""}
              className={fieldClassName}
            >
              <option value="" disabled>
                Choose a type
              </option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
          </label>
        </div>

        <label htmlFor="property-image-url" className={labelClassName}>
          Image URL <span className="font-normal text-slate-500">(optional)</span>
          <input
            id="property-image-url"
            name="image_url"
            type="url"
            defaultValue={values?.image_url}
            placeholder="https://example.com/image.jpg"
            className={fieldClassName}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClassName}>
            Maximum guests
            <input
              name="max_guests"
              type="number"
              min={1}
              required
              defaultValue={values?.max_guests}
              placeholder="e.g. 4"
              className={fieldClassName}
            />
          </label>
          <label className={labelClassName}>
            Price per night (kr)
            <input
              name="price_per_night"
              type="number"
              min={100}
              required
              defaultValue={values?.price_per_night}
              placeholder="e.g. 1200"
              className={fieldClassName}
            />
          </label>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>

      );
}