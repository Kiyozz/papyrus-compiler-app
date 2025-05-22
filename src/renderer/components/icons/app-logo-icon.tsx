import { type SVGProps } from 'react'

export function AppLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width="1em"
      height="1em"
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        // @ts-expect-error - imageRendering is not a valid property
        imageRendering: 'optimizeQuality',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
      viewBox="0 0 5045.83 5049.91"
      {...props}
    >
      <path
        d="M1342.99 0h3702.84v4409.73H2300.46V2995.97h1331.62V1413.75H2049.86v1331.59H636.11V0z"
        style={{
          fill: '#006cb0',
          fillRule: 'nonzero',
        }}
      />
      <path
        d="M5045.83 7.02v4402.71H2300.46V2995.98h1331.62V1430.72z"
        style={{
          fill: '#0081d1',
          fillRule: 'nonzero',
        }}
      />
      <path
        d="M2049.86 4409.73v640.18H636.11v-640.18H0V2995.97h636.11v-.03h1413.75v.03z"
        style={{
          fill: '#202020',
          fillRule: 'nonzero',
        }}
      />
      <path
        d="M2049.86 4409.73v640.18H636.11v-640.18l1413.75-1413.79v1413.78z"
        style={{
          fill: '#333',
          fillRule: 'nonzero',
        }}
      />
    </svg>
  )
}
