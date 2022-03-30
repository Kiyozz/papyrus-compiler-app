/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { Bridge } from '../common/types/bridge'

export const bridge: Bridge = (window as unknown as { bridge: Bridge }).bridge
