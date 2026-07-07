import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import authConfig from '@configs/auth'

export interface ListRequest {
  per_page?: number
  page?: number
  q?: string
  sort?: string
  field?: string
  distinct?: boolean
}

export interface Metadata {
  total?: number
  per_page?: number
  total_page?: number
  page?: number
}

export interface ListResponse<T> {
  data?: T[]
  metadata?: Metadata
  total?: number
  per_page?: number
  total_page?: number
  page?: number
}

export interface DataResponse<T> {
  data?: T
  success?: boolean
  status?: string
  message?: string
  errors?: any
}

export type FetchProps<Req> = {
  url?: string
  data?: Req
  method?: 'get' | 'post' | 'put' | 'delete'
  isAuthenticated?: boolean
  accessKey?: string
};

export function useAxios<ResponseBody, RequestBody = never>(
  props: FetchProps<RequestBody>
) {
  const {
    url,
    data: requestData = null,
    method = 'get',
    isAuthenticated = true,
    accessKey,
  } = props;

  const router = useRouter()
  const [data, setData] = useState<ResponseBody | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [error, setError] = useState<AxiosError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetch = async (newProps?: FetchProps<RequestBody>) => {
    const isGet = method === 'get'

    const accessKeyObj = accessKey ? { 'access-key': accessKey } : undefined;

    try {
      setIsLoading(true)
      setData(null)
      setStatusCode(null)
      setError(null)
      const authToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      const headers =
        isAuthenticated && authToken
          ? {
            Authorization: 'Bearer ' + authToken,
            ...accessKeyObj,
          }
          : undefined;

      const usedData = newProps?.data || requestData;
      const response = await axios({
        method,
        url: `${process.env.NEXT_PUBLIC_APP_URL}${newProps?.url || url}`,
        data: isGet ? undefined : usedData,
        params: isGet ? usedData : undefined,
        headers,
      });
      setData(response.data)
      setStatusCode(response.status)
    } catch (err) {
      setError(err as AxiosError)
      if (axios.isAxiosError(err)) {
        setData(err.response?.data)
        setStatusCode(err.response?.status ?? null)
      }
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (isAuthenticated && statusCode === 401) {
      // resetCredentials();
      router.push('/login')
    }
  }, [statusCode, isAuthenticated, router])

  return {
    data,
    error,
    isError: error !== null,
    isLoading,
    statusCode,
    fetch,
  };
}
