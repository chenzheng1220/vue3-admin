function isPC () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return false
    }
    return true
  }

function useSystem(){
    return {
        isPC:isPC(),
        isMobile:!isPC()
    }
}
export default useSystem