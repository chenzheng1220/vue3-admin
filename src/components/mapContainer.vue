<template>
    <div id="mapBox">

    </div>
</template>
<script setup>

import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;
var points = [
  {
    lnglat: ["116.506621867519", "39.925077049391"],
    building: "晨光家园",
    district: "朝阳区",
    city: "北京",
  },
  {
    lnglat: ["116.464047215754", "39.871715123709"],
    building: "松榆西里",
    district: "朝阳区",
    city: "北京",
  },
  {
    lnglat: ["116.557773237391", "39.903674644798"],
    building: "北花园街6号院",
    district: "朝阳区",
    city: "北京",
  },
  {
    lnglat: ["116.40499876945", "39.958000356032"],
    building: "安定门外大街80号院",
    district: "东城区",
    city: "北京",
  },
  {
    lnglat: ["116.412789588355", "39.957363077042"],
    building: "地坛北门",
    district: "东城区",
    city: "北京",
  },
];
var clusterIndexSet = {
  //定义点聚合规则
  city: {
    minZoom: 2,
    maxZoom: 10,
  },
  district: {
    minZoom: 10,
    maxZoom: 12,
  },
  building: {
    minZoom: 12,
    maxZoom: 22,
  },
};
onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "628dc0db7fdce3435e1213b40211a757",
  };
  AMapLoader.load({
    key: "6622446371d736b72a0be9a6d9301d2a", // 申请好的Web端开发者Key，首次调用 load 时必填
  })
    .then((AMap) => {
      map = new AMap.Map("mapBox",{
        zoom: 3.5, //地图级别
  center: [116.405285, 39.904989], //地图中心点
//   mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
//   viewMode: "2D", //设置地图模
      });
      var points = [
  { weight: 8, lnglat: ["116.506647", "39.795337"] },
  { weight: 1, lnglat: ["116.843352", "40.377362"] },
  { weight: 1, lnglat: ["116.637122", "40.324272"] },
  { weight: 1, lnglat: ["116.105381", "39.937183"] },
  { weight: 1, lnglat: ["116.653525", "40.128936"] },
  { weight: 1, lnglat: ["116.486409", "39.921489"] },
  { weight: 1, lnglat: ["116.658603", "39.902486"] },
  { weight: 1, lnglat: ["116.338033", "39.728908"] },
  { weight: 1, lnglat: ["116.235906", "40.218085"] },
  { weight: 1, lnglat: ["116.366794", "39.915309"] },
  { weight: 1, lnglat: ["116.418757", "39.917544"] },
  { weight: 1, lnglat: ["116.139157", "39.735535"] },
  { weight: 1, lnglat: ["116.195445", "39.914601"] },
  { weight: 1, lnglat: ["116.310316", "39.956074"] },
  { weight: 1, lnglat: ["116.286968", "39.863642"] },
];
//聚合点样式
var _renderClusterMarker = function (context) {
  //context 为回调参数，
  //包含如下属性 marker:当前聚合点，count:当前聚合点内的点数量
  var clusterCount = context.count; //聚合点内点数量
  context.marker.setContent(
    '<div style="background-color:#00ff00">' + clusterCount + "</div>"
  );
};
//非聚合点样式
var _renderMarker = function (context) {
  //context 为回调参数，
  //包含如下属性 marker:当前非聚合点
  context.marker.setContent('<div style="background-color:#ff0000">1</div>');
};
map.plugin(["AMap.MarkerCluster"], function () {
  cluster = new AMap.MarkerCluster(
    map, //地图实例
    points, //海量点数据，数据中需包含经纬度信息字段 lnglat
    {
      gridSize: 60, //数据聚合计算时网格的像素大小
      renderClusterMarker: _renderClusterMarker, //上述步骤的自定义聚合点样式
      renderMarker: _renderMarker, //上述步骤的自定义非聚合点样式
    }
  );
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
        width: 100%;
        height: 100%;
    }
</style>