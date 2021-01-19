import React, { useMemo } from 'react'

export interface MenuItemProps {
  label: string
}

export function MenuItem({
  label,
  children
}: React.PropsWithChildren<MenuItemProps>) {
  const hasChildren = useMemo(() => !!children, [children])

  return (
    <div className="h-full relative w-full">
      <button className="hover:bg-white hover:bg-opacity-10 py-0 min-w-full h-full px-2 cursor-default">
        {label}
      </button>

      {hasChildren && (
        <div className="absolute top-full z-20 min-w-full h-full flex justify-center items-center bg-purple-800">
          {children}
        </div>
      )}
    </div>
  )
}
