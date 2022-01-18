/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Bridge } from '../common/types/bridge'

const bridge: Bridge = (window as unknown as { bridge: Bridge }).bridge

export default bridge
