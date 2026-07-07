
import { useRouter } from "next/navigation"
import authConfig from '@configs/auth'

export const useDownload = () => {

  const router = useRouter()

  const download = (url: string, open: boolean, response = 'file') => {
    const authToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    const file = `${process.env.NEXT_PUBLIC_APP_URL}/api${url}?token=${authToken}&response=${response}`
    if (open) {
      window.open(file, '_blank')
    }
    return file
  }

  const downloadWithParams = (url: string, open: boolean, params: any, response = 'file') => {
    const authToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

    params.response = response
    params.token = authToken

    const file = `${process.env.NEXT_PUBLIC_APP_URL}/api${url}?` + new URLSearchParams(params).toString()
    if (open) {
      window.open(file, '_blank')
    }
    return file
  }

  return {
    download,
    downloadWithParams
  };
}
