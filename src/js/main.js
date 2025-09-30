document.addEventListener('DOMContentLoaded', () => {
  let barChart;
  const ctx = document.getElementById('barChart');
  const usernameInput = document.getElementById('username');
  const chartTab = document.getElementById('chart-tab');
  const downloadBtn = document.querySelector('.btn.btn-primary');

  // Username validation regex
  const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (ctx) {
    // Username input validation
    usernameInput?.addEventListener('input', () => {
      const username = usernameInput.value;
      const isValid = usernameRegex.test(username);
      usernameInput.style.borderColor = isValid ? 'green' : 'red';
      usernameInput.style.borderWidth = '2px';
    });

    // Chart tab event
    chartTab?.addEventListener('shown.bs.tab', () => {
      if (!barChart) {
        barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ],
            datasets: [
              {
                label: 'Income',
                data: Array(12).fill(0),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
              },
              {
                label: 'Expenses',
                data: Array(12).fill(0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
      updateChartData();
    });

    // Update chart on number input change
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        if (barChart) updateChartData();
      });
    });

    function updateChartData() {
      const { income, expenses } = getMonthlyIncomeExpenses();
      barChart.data.datasets[0].data = income;
      barChart.data.datasets[1].data = expenses;
      barChart.update();
    }
  }

  function getMonthlyIncomeExpenses() {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const income = months.map(month =>
      parseFloat(document.getElementById(`${month}-income`)?.value) || 0
    );
    const expenses = months.map(month =>
      parseFloat(document.getElementById(`${month}-expenses`)?.value) || 0
    );
    return { income, expenses };
  }

  function downloadCanvasImage(canvasId, filename = 'chart.png') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  }

  downloadBtn?.addEventListener('click', e => {
    e.preventDefault();
    downloadCanvasImage('barChart', 'chart.png');
  });
});