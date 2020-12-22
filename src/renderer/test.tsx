/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import './tailwind.css'
import './utilities.css'
import './app.css'

function App() {
  const [u, setU] = useState('')

  useEffect(() => {
    setInterval(() => setU(y => `${y}u`), 1000)
  }, [])

  return <div className="w-full h-full bg-white">test {u}</div>
}

render(<App />, document.getElementById('app'))
