/*
 * 2026 Kiyozz.
 */

import { RPCChannel } from 'kkrpc'
import type { MainAPI, RendererAPI } from '#common/types/api.ts'

export class RpcChannel extends RPCChannel<MainAPI, RendererAPI> {
  /**
   * kkrpc v2 only accepts the local API through the constructor options, but the
   * main API depends on services that themselves depend on this channel.
   */
  setApi(api: MainAPI): void {
    this.expose = api
  }
}
