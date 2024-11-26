import service from './axios';
export const getInfo = (url,data) => {
    return service({
        url:url,
        method:'get',
        params:data
    })
}

export const postInfo = (url,data) => {
   return service({
    url:url,
    method:'post',
    data:data
   })

}
