import appStore from '../../common/appStore'
import { Config } from '@common'
import { HandlerInterface } from '../HandlerInterface'
import Log from '../services/Log'

const log = new Log('ConfigUpdateHandler')

export default class ConfigGetHandler implements HandlerInterface {
  listen(): Config {
    log.info('Getting the configuration')

    return appStore.store
  }
}
