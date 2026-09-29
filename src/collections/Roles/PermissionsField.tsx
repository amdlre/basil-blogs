'use client'

import type { JSONFieldClientComponent } from 'payload'

import { FieldDescription, FieldLabel, useField, useTranslation } from '@payloadcms/ui'
import React, { useCallback } from 'react'

import {
  actionsFor,
  collectionActions,
  resources,
  type Action,
  type Permissions,
} from '@/access/permissions'
import { adminT, type AdminTranslationKey } from '@/i18n/admin'

import './PermissionsField.scss'

const actionLabel: Record<Action, AdminTranslationKey> = {
  create: 'permCreate',
  delete: 'permDelete',
  read: 'permRead',
  update: 'permUpdate',
}

type Resource = (typeof resources)[number]

/** Permissions matrix: one row per collection/global, one column per action. */
export const PermissionsField: JSONFieldClientComponent = ({ field, path, readOnly }) => {
  const { i18n } = useTranslation()
  const { setValue, value } = useField<Permissions>({ path })
  const permissions: Permissions = value && typeof value === 'object' ? value : {}
  const language = i18n.language === 'ar' ? 'ar' : 'en'

  const isChecked = (resource: Resource, action: Action) =>
    permissions[resource.slug]?.[action] === true

  const update = useCallback(
    (changes: { action: Action; checked: boolean; resource: Resource }[]) => {
      const next: Permissions = structuredClone(permissions)

      for (const { action, checked, resource } of changes) {
        if (!actionsFor(resource).includes(action)) continue
        const entry = { ...next[resource.slug] }

        if (checked) entry[action] = true
        else delete entry[action]

        // Any write permission implies being able to read
        if (checked && action !== 'read') entry.read = true
        // Without read, nothing else makes sense
        if (!checked && action === 'read') {
          for (const key of Object.keys(entry)) delete entry[key as Action]
        }

        if (Object.keys(entry).length) next[resource.slug] = entry
        else delete next[resource.slug]
      }

      setValue(next)
    },
    [permissions, setValue],
  )

  const rowChecked = (resource: Resource) =>
    actionsFor(resource).every((action) => isChecked(resource, action))

  const columnApplicable = (action: Action) =>
    resources.filter((resource) => actionsFor(resource).includes(action))

  const columnChecked = (action: Action) =>
    columnApplicable(action).every((resource) => isChecked(resource, action))

  const toggleRow = (resource: Resource) => {
    const checked = !rowChecked(resource)
    update(actionsFor(resource).map((action) => ({ action, checked, resource })))
  }

  const toggleColumn = (action: Action) => {
    const checked = !columnChecked(action)
    update(columnApplicable(action).map((resource) => ({ action, checked, resource })))
  }

  const setAll = (mode: 'all' | 'none' | 'readOnly') => {
    const next: Permissions = {}
    if (mode !== 'none') {
      for (const resource of resources) {
        const actions = mode === 'all' ? actionsFor(resource) : (['read'] as const)
        next[resource.slug] = Object.fromEntries(actions.map((action) => [action, true]))
      }
    }
    setValue(next)
  }

  return (
    <div className="field-type permissions-field">
      <FieldLabel label={field.label} path={path} />
      <FieldDescription
        description={adminT(i18n, 'permissionsHelp')}
        path={path}
      />

      {!readOnly && (
        <div className="permissions-field__presets">
          <button onClick={() => setAll('all')} type="button">
            {adminT(i18n, 'permSelectAll')}
          </button>
          <button onClick={() => setAll('readOnly')} type="button">
            {adminT(i18n, 'permReadOnly')}
          </button>
          <button onClick={() => setAll('none')} type="button">
            {adminT(i18n, 'permClear')}
          </button>
        </div>
      )}

      <div className="permissions-field__scroll">
        <table className="permissions-field__table">
          <thead>
            <tr>
              <th scope="col">{adminT(i18n, 'permSection')}</th>
              {collectionActions.map((action) => (
                <th key={action} scope="col">
                  <label className="permissions-field__head">
                    <input
                      aria-label={`${adminT(i18n, actionLabel[action])} — ${adminT(i18n, 'permAll')}`}
                      checked={columnChecked(action)}
                      disabled={readOnly}
                      onChange={() => toggleColumn(action)}
                      type="checkbox"
                    />
                    <span>{adminT(i18n, actionLabel[action])}</span>
                  </label>
                </th>
              ))}
              <th scope="col">{adminT(i18n, 'permAll')}</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.slug}>
                <th scope="row">
                  <span className="permissions-field__resource">{resource.label[language]}</span>
                  {resource.type === 'global' && (
                    <span className="permissions-field__tag">{adminT(i18n, 'permGlobal')}</span>
                  )}
                </th>
                {collectionActions.map((action) => (
                  <td key={action}>
                    {actionsFor(resource).includes(action) ? (
                      <input
                        aria-label={`${resource.label[language]} — ${adminT(i18n, actionLabel[action])}`}
                        checked={isChecked(resource, action)}
                        disabled={readOnly}
                        onChange={(event) =>
                          update([{ action, checked: event.target.checked, resource }])
                        }
                        type="checkbox"
                      />
                    ) : (
                      <span aria-hidden className="permissions-field__na">
                        —
                      </span>
                    )}
                  </td>
                ))}
                <td>
                  <input
                    aria-label={`${resource.label[language]} — ${adminT(i18n, 'permAll')}`}
                    checked={rowChecked(resource)}
                    disabled={readOnly}
                    onChange={() => toggleRow(resource)}
                    type="checkbox"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
