<template>
  <Line :chart-data="props.chartData" :chart-options="chartOptions" :height="400"></Line>

</template>

<script lang="ts" setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartData, ScatterDataPoint, ChartOptions, TimeScale } from 'chart.js';
import 'chartjs-adapter-dayjs-3';


ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, TimeScale);

const props = defineProps<{
  chartData: ChartData<'line', (number | ScatterDataPoint | null)[], unknown>
}>();

const chartOptions: ChartOptions<'line'> = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day'
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
};

ChartJS

</script>
