import { useState } from 'react'

const useRequest = function () {
  const [loading, setLoading] = useState(false)
  const request = function (service,...params) {
    setLoading(true)
    return service(...params).then(res=>{
      setLoading(false)
      return res
    }).catch((err)=>{
      setLoading(false)
      return Promise.reject(err)
    })
  }
  return [loading,request]
}
export default useRequest
