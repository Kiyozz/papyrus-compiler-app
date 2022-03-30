/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import React from 'react'
import type { ListItemButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

interface DrawerButtonProps {
  icon: ReactNode
  text: string
  onClick: ListItemButtonProps['onClick']
}

function DrawerButton({ icon, text, onClick }: DrawerButtonProps) {
  return (
    <ListItem aria-label={text} disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{ noWrap: true }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default DrawerButton
