/*
 * 2022-2026 Kiyozz.
 */

import React, { useState, type ReactNode } from 'react'
import type { DialogType } from '#common/types/dialog.ts'
import { bridge } from '@renderer/bridge.ts'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@renderer/components/ui/form.tsx'
import { Input } from '@renderer/components/ui/input.tsx'
import { Button } from '@renderer/components/ui/button.tsx'
import { FolderIcon, FolderOpenIcon } from 'lucide-react'
import { useLingui } from '@lingui/react/macro'

interface DialogTextFieldProps {
  name: string
  label?: ReactNode
  description?: ReactNode
  type: DialogType
}

function DialogTextField({
  name,
  label,
  description,
  type,
}: DialogTextFieldProps) {
  const { t } = useLingui()
  const [isHover, setHover] = useState(false)

  const onMouseEnter = () => {
    setHover(true)
  }
  const onMouseLeave = () => {
    setHover(false)
  }

  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  className="pl-10 text-xs"
                  placeholder={t`Sélectionner un dossier`}
                  {...field}
                />
              </FormControl>
              <Button
                variant="ghost"
                className="-translate-y-1/2 absolute top-1/2 left-0 rounded-r-none active:top-0 transition-none"
                size="icon"
                onClick={async (evt: React.MouseEvent<HTMLElement>) => {
                  setHover(false)
                  evt.preventDefault()
                  evt.currentTarget.blur()

                  try {
                    const result = await bridge.dialog
                      .select(type)
                      .then((response) => {
                        return response ?? undefined
                      })

                    if (typeof result !== 'undefined') {
                      field.onChange(result)
                    }
                  } catch (err) {
                    console.log(err)
                  }
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                {isHover ? (
                  <FolderOpenIcon className="size-4" />
                ) : (
                  <FolderIcon className="size-4" />
                )}
              </Button>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default DialogTextField
