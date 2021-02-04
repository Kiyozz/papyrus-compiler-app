/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import React from 'react'

interface Props {
  fontSize?: SvgIconProps['fontSize']
  color?: SvgIconProps['color']
  className?: string
}

export function AppIcon({ fontSize, color, className }: Props) {
  return (
    <SvgIcon fontSize={fontSize} color={color} className={className ?? ''}>
      <defs>
        <linearGradient
          gradientTransform="rotate(25)"
          id="324e5c29-7a43-46a6-bc3b-a2333200eecf"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#0076DD" />
          <stop offset="100%" stopColor="#E600E9" />
        </linearGradient>
      </defs>
      <g>
        <g>
          <g>
            <g transform="matrix(0.023261376487247822,0,0,0.023261376487247822,-53.75114056074676,-53.75114336268325) ">
              <g
                transform="matrix(11.07810326687287,0,0,11.07810326687287,149.97218195081322,154.81885626911432) "
                fill="url(#324e5c29-7a43-46a6-bc3b-a2333200eecf)"
              >
                <path d="m279.466348,216.466358l-35.8,-20.7c-1.6,-0.9 -3.6,-0.9 -5.2,0l-36.3,20.9l0.4,0c-1.7,0.9 -2.5,2.7 -2.5,4.7l0,39.5c0,1.9 0.5,3.6 2.2,4.5l36.4,21.2c0.8,0.5 1.6,0.7 2.5,0.7l0.2,0c0.9,0 1.8,-0.2 2.6,-0.7l36.6,-21.2c1.6,-0.9 2.6,-2.7 2.6,-4.5l0,-39.5c-0.1,-2.3 -1.6,-4.2 -3.7,-4.9zm-38.4,-10.2l25.8,14.9l-25.8,14.9l-25.8,-14.9l25.8,-14.9zm-31,51.6l0,-27.9l25,15.1l0,28l-25,-15.2zm35,15.2l0,-28.1l28,-15.1l0,28.1l-28,15.1z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}
