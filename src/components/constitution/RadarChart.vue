<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// 注册 Chart.js 组件
Chart.register(...registerables)

const props = defineProps({
  constitutionScores: {
    type: Array,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')

  const data = {
    labels: props.constitutionScores.map(s => s.name),
    datasets: [
      {
        label: '体质倾向',
        data: props.constitutionScores.map(s => s.score),
        backgroundColor: 'rgba(139, 111, 71, 0.2)',
        borderColor: 'rgba(139, 111, 71, 1)',
        borderWidth: 2,
        pointBackgroundColor: props.constitutionScores.map(s => s.color),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: props.constitutionScores.map(s => s.color),
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ': ' + context.parsed.r + '分'
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: Math.max(...props.constitutionScores.map(s => s.score)) + 5,
          ticks: {
            stepSize: 5
          },
          grid: {
            color: 'rgba(44, 36, 22, 0.1)'
          },
          pointLabels: {
            font: {
              size: 12,
              family: "'LXGW WenKai', sans-serif"
            },
            color: '#2C2416'
          }
        }
      }
    }
  }

  chartInstance = new Chart(ctx, config)
}

const updateChart = () => {
  if (!chartInstance) return

  chartInstance.data.labels = props.constitutionScores.map(s => s.name)
  chartInstance.data.datasets[0].data = props.constitutionScores.map(s => s.score)
  chartInstance.data.datasets[0].pointBackgroundColor = props.constitutionScores.map(s => s.color)
  chartInstance.data.datasets[0].pointHoverBorderColor = props.constitutionScores.map(s => s.color)
  chartInstance.options.scales.r.max = Math.max(...props.constitutionScores.map(s => s.score)) + 5

  chartInstance.update()
}

watch(
  () => props.constitutionScores,
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  createChart()
})
</script>

<style scoped>
.chart-wrapper {
  max-width: 500px;
  margin: 0 auto;
  aspect-ratio: 1;
}
</style>
