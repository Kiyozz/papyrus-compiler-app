/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { DialogType } from '../../../common/types/dialog'
import { bridge } from '@/bridge.ts'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { FolderIcon, FolderOpenIcon } from 'lucide-react'

interface DialogTextFieldProps {
  name: string
  label?: ReactNode
  type: DialogType
}

function DialogTextField({ name, label, type }: DialogTextFieldProps) {
  const { t } = useTranslation()
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
                <Input className="pl-10 text-xs" placeholder={t('common.selectFolder')} {...field} />
              </FormControl>
              <Button
                variant="ghost"
                className="-translate-y-1/2 absolute top-1/2 left-0 rounded-r-none"
                size="icon"
                onClick={async (evt: React.MouseEvent<HTMLElement>) => {
                  setHover(false)
                  evt.preventDefault()
                  evt.currentTarget.blur()

                  try {
                    const result = await bridge.dialog.select(type).then((response) => {
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
                {isHover ? <FolderOpenIcon className="size-4" /> : <FolderIcon className="size-4" />}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default DialogTextField
