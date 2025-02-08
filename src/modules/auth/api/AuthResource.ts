import { HttpMethods, type IHttpResourceOption } from '@/composable/fetch/useFetchHttp'

type KeyResource = 'login'

const resources: Record<KeyResource, IHttpResourceOption> = {
  login: <IHttpResourceOption>{
    path: '/login',
    method: HttpMethods.Post,
  },
}

export { resources }
