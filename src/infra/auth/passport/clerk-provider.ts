import { createClerkClient } from '@clerk/backend'

import { EnvProvider } from '@/infra/provision/env/env-provider'

export const ClerkProvider = {
  provide: 'CLERK',
  useFactory: (envProvider: EnvProvider) => {
    console.log(envProvider.get('CLERK_PUBLISHABLE_KEY'))
    return createClerkClient({
      publishableKey: envProvider.get('CLERK_PUBLISHABLE_KEY'),
      secretKey: envProvider.get('CLERK_SECRET_KEY'),
    })
  },
  inject: [EnvProvider],
}
