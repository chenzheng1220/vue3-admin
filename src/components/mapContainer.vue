<template>
    <div id="mapBox">

    </div>
</template>
<script setup>

import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
onMounted(() => {

  window._AMapSecurityConfig = {
    securityJsCode: "628dc0db7fdce3435e1213b40211a757",
  };
  AMapLoader.load({
    key: "6622446371d736b72a0be9a6d9301d2a", // 申请好的Web端开发者Key，首次调用 load 时必填
  })
    .then((AMap) => {
        const map = new AMap.Map("mapBox", {
        center: [104.937478,35.439575],
        zoom: 5
    });
   
   



    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<style lang="scss">
    #mapBox{
        width: 60%;
        height: 100%;
    }
</style>