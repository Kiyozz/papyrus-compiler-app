/*
 * 2026 Kiyozz.
 */

import { RPCChannel } from 'kkrpc/electron-ipc'
import type { MainAPI, RendererAPI } from '#common/types/api.ts'

export class RpcChannel extends RPCChannel<MainAPI, RendererAPI> {}
