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
        let row = `<tr><td>커퍼 ${i}</td>`;
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
    for (let i = 1; i <= numCuppers; i++) {
        let cupperScores = [];
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
        return 100 - (Math.abs(personalAvg - overallAvg) / overallAvg * 100);
    });

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: scores.map((_, i) => `커퍼 ${i + 1}`),
            datasets: [
                { label: '평균 일치율 (%)', data: conformity, backgroundColor: '#36a2eb' },
                { label: '점수 폭', data: ranges, backgroundColor: '#ff6384' }
            ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

function saveData() {
    const data = document.documentElement.outerHTML;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cupper-data.json';
    a.click();
}

function loadData() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            document.documentElement.innerHTML = event.target.result;
        };
        reader.readAsText(file);
    };
}
