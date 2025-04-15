
function generateTable() {
    const numCuppers = document.getElementById('numCuppers').value;
    const numCoffees = document.getElementById('numCoffees').value;

    const headerRow = document.getElementById('headerRow');
    headerRow.innerHTML = '<th>커퍼 이름</th>';
    for (let i = 1; i <= numCoffees; i++) {
        headerRow.innerHTML += `<th>커피 ${i}</th>`;
    }

    const tbody = document.getElementById('scores');
    tbody.innerHTML = '';
    for (let i = 1; i <= numCuppers; i++) {
        let row = `<tr><td><input type="text" id="cupperName${i}" placeholder="커퍼 ${i}"></td>`;
        for (let j = 1; j <= numCoffees; j++) {
            row += `<td><input type="number" id="cupper${i}_coffee${j}" min="70" max="100"></td>`;
        }
        row += '</tr>';
        tbody.innerHTML += row;
    }
}

function calculate() {
    const numCuppers = document.getElementById('numCuppers').value;
    const numCoffees = document.getElementById('numCoffees').value;

    let scores = [];
    let names = [];

    for (let i = 1; i <= numCuppers; i++) {
        let cupperScores = [];
        let name = document.getElementById(`cupperName${i}`).value || `커퍼 ${i}`;
        names.push(name);
        for (let j = 1; j <= numCoffees; j++) {
            const score = parseFloat(document.getElementById(`cupper${i}_coffee${j}`).value) || 0;
            cupperScores.push(score);
        }
        scores.push(cupperScores);
    }

    const coffeeAverages = [];
    for (let j = 0; j < numCoffees; j++) {
        const avg = scores.reduce((sum, row) => sum + row[j], 0) / numCuppers;
        coffeeAverages.push(avg);
    }

    const overallAvg = coffeeAverages.reduce((a, b) => a + b) / coffeeAverages.length;

    const ranges = scores.map(row => Math.max(...row) - Math.min(...row));
    const conformity = scores.map(row => {
        const personalAvg = row.reduce((a, b) => a + b) / row.length;
        const diff = Math.abs(personalAvg - overallAvg);
        const scaled = Math.max(0, 100 - (diff / 30) * 100);
        return Math.round(scaled);
    });

    const ctx = document.getElementById('chart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [
                {
                    label: '평균 일치율 (%)',
                    data: conformity,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: '#000',
                    borderWidth: 1
                },
                {
                    label: '점수 폭',
                    data: ranges,
                    backgroundColor: 'rgba(180, 180, 180, 0.8)',
                    borderColor: '#000',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#000' }
                },
                x: {
                    ticks: { color: '#000' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#000' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.formattedValue}%`;
                        }
                    }
                },
                datalabels: {
                    color: '#000',
                    anchor: 'end',
                    align: 'start',
                    formatter: Math.round,
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
