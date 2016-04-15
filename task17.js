/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: "0"
};
// 随机颜色生成函数
function RandomColor(){
  return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
}
// 图表背景图层
function chartwrap() {
  document.querySelector(".aqi-chart-wrap").style.cssText = "width: 100%;height: 520px;background-color: white;display: flex;flex-flow: row nowrap;align-items: flex-end;"; //强行不让换行，我的心好痛
}
/*
* 渲染图表
*/
function renderChart() {
  chartwrap();
  var chart = "";
  for(var i in chartData){
    chart+="<div style='height:"+chartData[i]+";width:33%;background-color:"+RandomColor()+";margin:3px' title='aqi:"+chartData[i]+"&#13Time:"+i+"'></div>";
  }
  document.querySelector(".aqi-chart-wrap").innerHTML = chart;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  for(var i in document.getElementsByName("gra-time")){
    if(document.getElementsByName("gra-time")[i].checked){
      pageState.nowGraTime = i;
    };
  }
  // 设置对应数据
  chartData = aqiSourceData[document.querySelector("select")[pageState.nowSelectCity].innerHTML];
  switch (pageState.nowGraTime) {
    case "1":
      var sum=0,avg=0,count=0,week=0,temp={};
      for(var i in chartData){
         sum+=chartData[i];
        count++;
        if(new Date(i).getDay()==0){
          avg = Math.round(sum/count);
          var key;
          if(week<=9){key="第0"+week+"周";}
          else {key="第"+week+"周";};
          temp[key]=avg;
          week++;
          sum=0;
          count=0;
        }; 
      };
      temp["第"+week+"周"]=Math.round(sum/count);
      chartData = temp;
      break;
    case "2":
      var sum=0,avg=0,count=0,nowMonth=1,temp={};
      for(var i in chartData){
        sum+=chartData[i];
        count++;
        if(new Date(i).getMonth()+1!=nowMonth){
          avg = Math.round(sum/count);
          temp[nowMonth+"月"]=avg;
          nowMonth++;
          sum=0;
          count=0;
        };
      };
      temp[nowMonth+"月"]=Math.round(sum/count);
      chartData = temp;
      break;
  }
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  // 设置对应数据
  pageState.nowSelectCity = document.querySelector("select").selectedIndex;
  chartData = aqiSourceData[document.querySelector("select")[pageState.nowSelectCity].innerHTML];
  // 调用图表渲染函数
  graTimeChange();
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  document.querySelector("#form-gra-time").onclick = graTimeChange;
}

/**
 * 初始化城市Select下拉选择框中的选项
 */

function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var list = "";
  for(var i in aqiSourceData){
    list+="<option>"+i+"</option>";
  }
  document.querySelector("select").innerHTML=list;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  document.querySelector("select").onchange = citySelectChange;
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = aqiSourceData[document.querySelector("select")[pageState.nowSelectCity].innerHTML];
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

init();