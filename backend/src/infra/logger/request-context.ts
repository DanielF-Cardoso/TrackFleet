import { createNamespace } from 'cls-hooked'

const namespace = createNamespace('request')

export const RequestContext = {
  set: (key: string, value: any) => {
    namespace.set(key, value)
  },
  get: <T = any>(key: string): T | undefined => {
    return namespace.get(key)
  },
  run: (callback: () => void) => {
    namespace.run(callback)
  },
}
