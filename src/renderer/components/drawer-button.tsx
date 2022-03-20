/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import {
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import React, { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  text: string
  onClick: ListItemButtonProps['onClick']
}

const DrawerButton = ({ icon, text, onClick }: Props) => {
  return (
    <ListItem disablePadding aria-label={text}>
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
