<template>
    <div>
        <div>首页</div>
        <div>倒计时：{{remainingTime.days}}天{{ remainingTime.hours }}时{{ remainingTime.minutes }}分{{ remainingTime.seconds }}秒</div>
        <div id="main" style="height:800px;"></div>
    </div>
</template>

<script setup>
   import { ref,reactive,onMounted, onUnmounted,nextTick} from 'vue';
   import * as echarts from 'echarts';

// 基于准备好的dom，初始化echarts实例



  const remainingTime = reactive({days:'',hours:'',minutes:'',seconds:''});
  let timerId

  // 设置倒计时并执行函数
   function setCountdown(targetDate, callback) {
    const targetTime = new Date(targetDate).getTime()
   
    timerId = setInterval(() => {

      const currentTime = new Date().getTime();
      const timeDiff = targetTime - currentTime;

      if (timeDiff <= 0) {
        clearInterval(timerId)
        callback();
      } else {
        remainingTime.days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        remainingTime.hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        remainingTime.minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        remainingTime.seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
    
      }
    }, 1000);
   
  }
  
  const info = () => {
    alert("倒计时结束！");
  }

  
  onMounted(() => {

    setCountdown(new Date("2024-06-21 00:00:00"),info);
    console.log('remaining',remainingTime);
    const myChart = echarts.init(document.getElementById('main'));
// 绘制图表
myChart.setOption({
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
});
   
  })
  

  // 组件卸载时清除计时器
  onUnmounted(() => {
    clearInterval(timerId)
  })

 

</script>

<style lang="scss">

</style>