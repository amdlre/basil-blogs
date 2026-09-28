import type { Field, UploadField } from 'payload'

/**
 * An image that is shared by every language by default, with an opt-in checkbox to
 * pick a different image per language. Produces three sibling fields:
 *
 * - `<name>`           the shared image (the original field, not localized)
 * - `<name>PerLocale`  checkbox: "Use a different image for each language"
 * - `<name>Localized`  localized image, only shown when the checkbox is on
 *
 * Read it on the frontend with `resolveLocalizedUpload(data, '<name>')`.
 */
export const localizedUpload = (field: UploadField): Field[] => {
  const { name } = field
  const toggleName = `${name}PerLocale`

  return [
    field,
    {
      name: toggleName,
      type: 'checkbox',
      label: {
        ar: 'استخدام صورة مختلفة لكل لغة',
        en: 'Use a different image for each language',
      },
      admin: field.admin?.condition ? { condition: field.admin.condition } : undefined,
    },
    {
      name: `${name}Localized`,
      type: 'upload',
      relationTo: field.relationTo,
      localized: true,
      label: {
        ar: 'صورة هذه اللغة',
        en: 'Image for this language',
      },
      admin: {
        condition: (data, siblingData, ctx) =>
          Boolean(siblingData?.[toggleName]) &&
          (field.admin?.condition ? Boolean(field.admin.condition(data, siblingData, ctx)) : true),
        description: {
          ar: 'بدّل اللغة من أعلى الصفحة لاختيار صورة لكل لغة. إذا تركته فارغاً ستُستخدم الصورة المشتركة.',
          en: 'Switch the language at the top of the page to set an image per language. Leave empty to use the shared image.',
        },
      },
    } as UploadField,
  ]
}
