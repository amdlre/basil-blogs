/**
 * Pick the image to show for the current locale from fields created by `localizedUpload()`:
 * the per-language image when the toggle is on and one is set, otherwise the shared image.
 */
export const resolveLocalizedUpload = <TData extends object, TName extends keyof TData & string>(
  data: TData | null | undefined,
  name: TName,
): TData[TName] | undefined => {
  if (!data) return undefined

  const fields = data as Record<string, unknown>
  const localized = fields[`${name}Localized`]

  if (fields[`${name}PerLocale`] && localized) return localized as TData[TName]

  return data[name]
}
