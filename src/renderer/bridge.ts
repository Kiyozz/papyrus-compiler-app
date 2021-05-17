/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Bridge } from '../common/interfaces/bridge'

const bridge: Bridge = (window as unknown as { bridge: Bridge }).bridge

export default bridge
