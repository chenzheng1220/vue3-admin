<template>
  <div class="chart">
    <div class="data">
      <div class="item">
        <p>发布文章</p>
        <p> <el-statistic :value="newArticle" /></p>
      </div>
      <div class="item">
        <p>文章分类</p>
        <p><el-statistic :value="newCategory" /></p>
      </div>
      <div class="item">
        <p>PV</p>
        <p><el-statistic :value="newPV" /></p>
      </div>
      <div class="item">
        <p>UV</p>
        <p><el-statistic :value="newUV" /></p>
      </div>
    </div>

    <div class="chartBox">
      <div id="chartBar"></div>
      <div id="chartPie"></div>
    </div>

    <div id="chartLine">
       
    </div>

    <div class="chartData">
      <div id="chartMap">
        <mapContainer/>
      </div>

      <div id="chartDevice">

      </div>
    </div>

    <div class="tableTitle">
      <h2>博客访问详情</h2>
      <el-button type="primary" @click="exportToExcel">导出execl</el-button>
    </div>
    <el-table :data="tableData" stripe border table-layout="auto" style="width: 100%">
      <el-table-column min-width='120px' fixed prop="ip" label="访客IP"  />
      <el-table-column min-width='120px' prop="city" label="所在城市"  />
      <el-table-column min-width='120px' prop="platform" label="操作系统平台" />
      <el-table-column min-width='120px' prop="browser" label="浏览器" />
      <el-table-column min-width='120px' prop="screen" label="设备分辨率" />
      <el-table-column min-width='120px' prop="count" label="访问次数" />
      <el-table-column min-width='120px' prop="visitTime" label="最新访问时间" />
      <el-table-column min-width="120px" label="操作日志" fixed="right">
        <template #default="scope">
          <el-button   
          type="success"   
          plain
          @click="handleView(scope.$index,scope.row)">
            查看
          </el-button>
          </template>
      </el-table-column>
    </el-table>

    <trackDialog :trackList="trackList" :isShow="isShow" @close="isShow = false"></trackDialog>

    <div class="page">
      <el-pagination 
        background 
        layout="prev, pager, next" 
        @current-change="handleCurrentChange"
        :total="total" />
    </div>
  </div>

</template>

<script setup>
   import { ref,reactive,onMounted,nextTick} from 'vue';
   import * as echarts from 'echarts';
   import {postInfo,getInfo} from '@/utils';
   import { useTransition } from '@vueuse/core';
   import * as XLSX from 'xlsx'; 
   import mapContainer from '@/components/mapContainer.vue';
   import trackDialog from '@/components/trackDialog.vue';
   const articleTotal = ref(0);
   const categoryTotal = ref(0);
   const pvTotal = ref(0);
   const uvTotal = ref(0);
   const trackList = ref([]);
   const deviceList = ref([]);
   const isShow = ref(false);
   const state = reactive({
      pageNumber:1,
      pageSize:12
   })
   const line = reactive({
    dateList:[],
    pvList:[],
    uvList:[]
   })
   const pieList = ref([]);
   const barList = reactive({
    dateList:[],
    dataList:[]
   })
   const total = ref(0);
   const tableData = ref([]);
   const newArticle = useTransition(articleTotal, {
      duration: 1500,
    })
    const newCategory = useTransition(categoryTotal, {
      duration: 1500,
    })
    const newPV = useTransition(pvTotal, {
      duration: 1500,
    })
    const newUV = useTransition(uvTotal, {
      duration: 1500,
    })
    const handleView = async(index,row) => {
      const res = await postInfo('/getTrack',{ip:row.ip});
      trackList.value = res.data.list;
      isShow.value = true ;
    }
    
   
   
    nextTick(() => {
    
    })

    
  const handleCurrentChange = async(val) => {
    state.pageNumber = val;
    await getVisitorsList();
  }

   const getVisitorsList = async() => {
    const res = await postInfo('/getVisitors',state);
     tableData.value = res.data.list;
     uvTotal.value = res.data.totalNum;
     pvTotal.value = res.data.pv;
     total.value = res.data.totalNum;
   }

   const getLastWeekVisitors = async() => {
    const res = await postInfo('/getLastWeekVisitors');
    const data = res.data.list;
    line.dateList = data.reduce((acc,item) => [...acc,item.date],[]);
    line.pvList = data.reduce((acc,item) => [...acc,item.pv],[]);
    line.uvList = data.reduce((acc,item) => [...acc,item.uv],[]);

   }

   const getArticleCategoryStatistics  = async() => {
    const res = await getInfo('/getArticleCategoryStatistics');
    pieList.value = res.data.list;
    articleTotal.value = res.data.list.reduce((acc,item) => acc + item.value,0);
    categoryTotal.value = res.data.list.length;
   }

   const getLastYearArticleData = async() => {
    const res = await postInfo('/getLastYearArticleData');
    const data = res.data.list;
    barList.dateList = data.reduce((acc,item) => [...acc,item.month],[]);
    barList.dataList = data.reduce((acc,item) => [...acc,item.value],[]);
   }

   const getDeviceStatistics = async() => {
    const res = await getInfo('/getDeviceStatistics');
    deviceList.value = res.data.list;
  }

   const exportToExcel = async() => {
    const res = await postInfo('/getAllVisitors');
    const list = res.data.list;
    const worksheet = XLSX.utils.json_to_sheet(list);
    const columnHeaders = ['访客IP','所在城市','操作系统平台','浏览器','设备分辨率','访问次数','最新访问时间'];
    XLSX.utils.sheet_add_aoa(worksheet, [columnHeaders], { origin: 'A1' });
   
    const uniformColumnWidth = 22; // 统一列宽度，单位是字符宽度
    const columnWidths = Array(columnHeaders.length).fill({ wch: uniformColumnWidth });
    worksheet['!cols'] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, '博客访问详情.xlsx');
   }

  

  onMounted(async() => {
    await getVisitorsList();
    await getLastWeekVisitors();
    await getArticleCategoryStatistics();
    await getLastYearArticleData();
    await getDeviceStatistics();
    await nextTick();
    const myChartLine = echarts.init(document.getElementById('chartLine'));
    const myChartPie = echarts.init(document.getElementById('chartPie'));
    const myChartBar = echarts.init(document.getElementById('chartBar'));
    const myChartDevice = echarts.init(document.getElementById('chartDevice'));

    let optionLine = {
      title: {
        text: '近一周博客访问量趋势图',
        padding:12
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['UV','PV']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'15%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: line.dateList
      },
      yAxis: {
        type: 'value'
      },
      series: [
      {
          name: 'UV',
          type: 'line',
          stack: 'Total',
          data: line.uvList
        },
      {
          name: 'PV',
          type: 'line',
          stack: 'Total',
          data: line.pvList
        }
      ]
    };
    let optionPie = {
      title:{
        text:"文章分类统计",
        padding:12
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        width:20,
        top: '12%',
        left: '3%'
      },
      grid:{
        left:'center',
        top:'6%'
      },
      series: [
        {
          name: '分类统计',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieList.value
        }
      ]
    };
    let optionBar = {
      title:{
        text:"近一年发布文章数量统计",
        padding:12
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'15%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: barList.dateList,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '发布数量',
          type: 'bar',
          barWidth: '60%',
          data: barList.dataList
        }
      ]
    };
    let deviceOptions = {
      title: {
        text: '设备类型统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '设备类型',
          type: 'pie',
          radius: '50%',
          data: deviceList.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChartLine.setOption(optionLine);
    myChartPie.setOption(optionPie);
    myChartBar.setOption(optionBar);
    myChartDevice.setOption(deviceOptions);
  
    window.addEventListener('resize',() => {
      myChartLine.resize();
      myChartPie.resize();
      myChartBar.resize();
      myChartDevice.resize();
    })
  })

 

</script>

<style lang="scss">
  .chart{
    width:100%;
    .data{
      width:100%;
      display:flex;
      justify-content:space-between;
      margin:0 0 20px;
      .item{
        width:24%;
        height:120px;
        background-color:#ffffff;
        box-shadow: 0 0 5px rgba(114, 124, 245, .5);
        >p{
          width:100%;
          height:50%;
          display:flex;
          justify-content:center;
          align-items:center;
          font-size:22px;
          letter-spacing: 1px;
          &:first-child{
            border-bottom:1px dashed rgba(114, 124, 245, .5);
          }
         
        }
      }
    }
    .chartBox{
      width:100%;
      display:flex;
      height:400px;
      >div{
        background-color:#ffffff;
        box-shadow: 0 0 5px rgba(114, 124, 245, .5);
       
      }
      #chartBar{
        width:60%;
        margin-right:20px;
      }
      #chartPie{
        width:40%;
      
      }
    }
    #chartLine{
      width:100%;
      height:400px;
      background-color:#ffffff;
      box-shadow: 0 0 5px rgba(114, 124, 245, .5);
      margin:20px 0;
    }
    .chartData{
      width:100%;
      height:500px;
      display:flex;
      margin:12px auto;
      >div{
        height:100%;
        padding:12px;
        background-color:#ffffff;
      }
      #chartMap{
        width:60%;
        margin-right:20px;
      }
      #chartDevice{
        width:40%;
      }
    }
    .tableTitle{
      width:100%;
      display:flex;
      align-items:center;
      justify-content: space-between;
      background-color:#ffffff;
      padding:6px 24px;
      >h2{
        font-size:18px;
      }
    }
    .page{
      display:flex;
      justify-content:center;
      margin:50px auto;
    }
  }
  @media screen and (max-width:768px){
    .chart{
      width:100%;
      .data{
        margin:0 0 5px;
      }
      .chartBox{
        width:100%;
        #chartBar{
          margin-right:5px;
        }
      }
      #chartLine{
        margin:5px 0;
      }
      .page{
        margin:30px 0; 
      }
    }
  }
</style>