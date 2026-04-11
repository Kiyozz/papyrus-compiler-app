/*
 * 2022-2026 Kiyozz.
 */

import type { Bridge } from '../common/types/bridge'

export const bridge: Bridge = (window as unknown as { bridge: Bridge }).bridge
