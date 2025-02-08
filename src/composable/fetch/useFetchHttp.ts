import type { Ref } from 'vue'
import { ref } from 'vue'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AxiosError } from 'axios'
import { useCrypto } from '@/composable/crypto/useCrypto'
import { useRouter } from 'vue-router'

const { decryptAES } = useCrypto()

export enum HttpMethods {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Patch = 'patch',
  Delete = 'delete',
}

export interface IHttpResourceOption {
  baseUrl?: string
  path: string
  method: HttpMethods
  headers?: Record<string, any>
  header?: Record<string, any>
  params?: Record<string, any>
  paramsRoute?: Array<any>
  data?: Record<string, any> | FormData
  timeout?: number
  auth?: Record<string, any>
  responseType?: string
  token?: string
  nameToken?: string
  download?: boolean
  nameDocument?: string
}

export interface IHttpResponse {
  responseCode: string
  code?: number
  responseAction: string
  status: boolean
  data: any[]
  title?: string
  message: string
  otherMessage: string
  otherData: any[]
}

export function useFetchHttp() {
  /****************************************************************************/
  /*                             VARIABLES                                    */
  /****************************************************************************/

  const loading: Ref<boolean> = ref<boolean>(false)
  const router = useRouter()

  /****************************************************************************/
  /*                             METHODS                                      */
  /****************************************************************************/

  const _onRequestSuccess = async (response: any) => {
    return response
  }

  const _onRequestFailure = async (error: any) => {
    const { response } = error
    console.log('ERROR: ', response)
    if (response) {
      if (response.status == 401) {
        localStorage.clear()
        router.push({ path: '/auth/login' })
      } else {
        return Promise.reject(error)
      }
    } else {
      localStorage.clear()
      router.push({ path: '/auth/login' })
    }
  }

  const fetchHttpResource = async (options: IHttpResourceOption, loading = true): Promise<any> => {
    const storedToken =
      sessionStorage.getItem(import.meta.env.VITE_NAME_TOKEN) ||
      localStorage.getItem(import.meta.env.VITE_NAME_TOKEN)

    const token: string | null = options.token ? options.token : decryptAES(storedToken ?? '')

    const authorization: { authorization?: string } = {}
    if (token !== null && token !== '') {
      authorization['authorization'] = `Bearer ${token}`
    }

    let url = `${options.baseUrl ?? import.meta.env.VITE_CLIENT_API_URL}${options.path}`
    const method: string = options.method
    const headers: Record<string, any> =
      (options.headers ?? false)
        ? { ...authorization, ...options.headers }
        : {
            'content-type': 'application/json; charset=utf-8',
            ...authorization,
          }

    const params: Record<string, any> = options.params ?? {}
    const paramsRoute: Array<any> = Array.isArray(options.paramsRoute) ? options.paramsRoute : []
    const data: Record<string, any> = options.data ?? {}
    const timeout: number = options.timeout ?? 0
    const auth: Record<string, any> | null = options.auth ?? null
    const download: boolean = options.download ?? false
    const responseType: string = options.download ? 'blob' : 'json'
    let body: IHttpResponse

    if (loading) showLoad()

    url = paramsRoute.length > 0 ? url + paramsRoute.join().split(',').join('/') : url

    try {
      const response = await axios(<AxiosRequestConfig>{
        url,
        method,
        headers,
        params,
        data,
        timeout,
        auth,
        responseType,
      })

      if (download) {
        body = await downloadResource(response, options.nameDocument || '')
        if (loading) hideLoad()
      } else {
        body = response?.data as IHttpResponse
        if (body.code === 401) {
          localStorage.clear()
          router.push({ path: '/auth/login' })
        }
      }
    } catch (err) {
      if (loading) hideLoad()
      body = await catchAxiosError(err)
    }

    if (loading) hideLoad()

    return body
  }

  const showLoad = () => {
    loading.value = true
    console.log('Loading...')
  }

  const hideLoad = () => {
    loading.value = false
    console.log('Loading finished.')
  }

  const getFileExtension = (contentType: string): string => {
    switch (contentType.toLowerCase()) {
      case 'application/vnd.ms-excel':
        return 'xls'
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'xlsx'
      case 'application/pdf':
        return 'pdf'
      case 'text/csv':
        return 'csv'
      case 'application/msword':
        return 'doc'
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx'
      case 'application/zip':
        return 'zip'
      case 'image/jpeg':
        return 'jpg'
      case 'image/png':
        return 'png'
      default:
        return 'txt'
    }
  }

  const downloadResource = async (
    response: AxiosResponse | null,
    name: string,
  ): Promise<IHttpResponse> => {
    if (response === null)
      return {
        responseCode: 'IKERR',
        responseAction: '',
        status: false,
        data: [],
        message: 'No se pudo descargar el recurso específico',
        otherMessage: '',
        otherData: [],
      } as IHttpResponse

    const getFileNameFromHeader = (headers: any): string | null => {
      const contentDisposition = headers['content-disposition']

      if (!contentDisposition) return null

      const filenameMatch = contentDisposition.match(/filename=([^;]+)/)
      if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/["']/g, '')
      }
      return null
    }

    if (response?.headers['content-type'] === 'application/json') {
      const blob: Blob = new Blob([response?.data])
      const text: string = await blob.text()
      const res: IHttpResponse = JSON.parse(text)

      if (!res.status) {
        console.error('Hubo un fallo en la descarga')
        return res
      }
    }

    const contentType = response?.headers['content-type'] || ''
    const blob = new Blob([response?.data], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const headerFileName = getFileNameFromHeader(response?.headers)
    const fileName = name || headerFileName || 'download'

    // Solo agregar extensión si el nombre no la tiene ya
    const extension = getFileExtension(contentType)
    const fullFileName = fileName.includes('.') ? fileName : `${fileName}.${extension}`

    link.setAttribute('download', fullFileName)
    link.click()

    window.URL.revokeObjectURL(url)
    link.remove()

    console.log('¡Descarga completa!')

    return {
      responseCode: 'IKSUC',
      responseAction: '',
      status: true,
      data: [],
      message: 'Descarga realizada',
      otherMessage: '',
      otherData: [],
    } as IHttpResponse
  }

  const catchAxiosError = async (err: any): Promise<IHttpResponse> => {
    let body: IHttpResponse = {
      responseCode: 'IKERR',
      responseAction: '',
      status: false,
      data: [],
      message: 'Ha sucedido un inconveniente en la solicitud HTTP',
      otherMessage: '',
      otherData: [],
    }

    if (axios.isAxiosError(err)) {
      const error: AxiosError = err
      const response = err.response as AxiosResponse
      body = response?.data ?? body

      if (error?.code === 'ERR_NETWORK') {
        return onNetworkError()
      } else if (error?.response?.status === 401) {
        return onUnauthorized(response)
      } else if (error?.response?.status === 404) {
        return onNotFound(response)
      }
    }

    return body
  }

  const onNetworkError = (): IHttpResponse => {
    return {
      responseCode: 'IKERR',
      responseAction: '',
      status: false,
      data: [],
      message: 'Ha sucedido un error en la red, se recomienda revisar su conexión a internet',
      otherMessage: '',
      otherData: [],
    }
  }

  const onUnauthorized = (response: AxiosResponse): IHttpResponse => {
    return {
      responseCode: 'IKERR',
      responseAction: '',
      status: false,
      data: [],
      message: response?.data?.message ?? 'Recurso no autorizado',
      otherMessage: '',
      otherData: [],
    }
  }

  const onNotFound = (response: AxiosResponse): IHttpResponse => {
    return {
      responseCode: 'IKERR',
      responseAction: '',
      status: false,
      data: [],
      message: response?.data?.message ?? 'No se encontró el recurso específico',
      otherMessage: '',
      otherData: [],
    }
  }

  /****************************************************************************/
  /*                              INJECT                                      */
  /****************************************************************************/
  axios.interceptors.response.use(_onRequestSuccess, _onRequestFailure)

  return { loading, fetchHttpResource }
}
