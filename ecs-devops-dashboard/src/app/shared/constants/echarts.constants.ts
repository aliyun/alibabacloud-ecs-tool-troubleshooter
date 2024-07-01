import {EChartsOption} from "echarts"

export const emptyLineChartOptions: EChartsOption = {
  title: {
    text: '{a|}  ',
    textStyle: {
      fontSize: 12,
      fontFamily: 'PingFangSC',
      fontWeight: 500,
      rich: {
        a: {
          width: 7,
          height: 7,
          backgroundColor: '#0070CC',
          borderRadius: 5,
        }
      }
    }
  },
  grid: {
    left: 10,
    top: 40,
    right: 20,
    bottom: 20,
    containLabel: true
  },
  xAxis: {
    data: [],
  },
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 0,
      axisLabel: {
        formatter: '  '
      },
      splitLine: {
        show: true,
      },
    }
  ],
  series: []
}


/**
 * 饼图 通用 options 配置
 */
export const basePieOptions: EChartsOption = {
  title: {
    text: '  {a|}  饼图',
    textStyle: {
      fontSize: 12,
      fontWeight: 500,
      rich: {
        a: {
          width: 7,
          height: 7,
          backgroundColor: '#0070CC',
          borderRadius: 5,
        },
        b: {
          fontSize: '17px',
        }
      }
    }
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 10,
    top: 0,
    type: 'scroll',
  },
  series: [
    {
      name: '',
      type: 'pie',
      center: ['67%', '50%'],
      radius: ['30%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      data: [],
      emphasis: {
        label: {
          show: true,
          formatter: '{c}',
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      }
    }
  ]
};


export const baseHistogramChart: EChartsOption = {
  title: {
    text: '  {a|}  直方图',
    left: 'left',
    textStyle: {
      fontSize: 12,
      fontWeight: 500,
      rich: {
        a: {
          width: 7,
          height: 7,
          backgroundColor: '#0070CC',
          borderRadius: 5,
        },
        b: {
          fontSize: '17px',
        }
      }
    }
  },
  tooltip: {},
  xAxis: {
    scale: true
  },
  yAxis: {},
  series: [
    {
      type: 'custom',
      renderItem: function (params, api: any) {
        const yValue = api.value(2);
        const start = api.coord([api.value(0), yValue]);
        const size = api.size([api.value(1) - api.value(0), yValue]);
        const style = api.style();
        return {
          type: 'rect',
          shape: {
            x: start[0],
            y: start[1],
            width: size[0],
            height: size[1]
          },
          style: style
        };
      },
      encode: {
        x: [0, 1],
        y: 2,
        tooltip: [2]
      },
      label: {
        show: true,
        position: 'top'
      },
      data: []
    }
  ]
};
