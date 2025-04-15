
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

    const conformity = scores.map(row => {
        const personalAvg = row.reduce((a, b) => a + b) / row.length;
        const diff = Math.abs(personalAvg - overallAvg);
        const scaled = Math.max(0, 100 - (diff * 5)); // 0% if 20+ difference, 100% if 0 difference
        return Math.min(100, Math.round(scaled));
    });

    const results = document.createElement('table');
    results.innerHTML = `
        <thead>
            <tr>
                <th>커퍼 이름</th>
                <th>일치도 (%)</th>
                <th>점수 평균</th>
                <th>점수 폭</th>
            </tr>
        </thead>
        <tbody>
            ${scores.map((row, i) => {
                const min = Math.min(...row);
                const max = Math.max(...row);
                const avg = (row.reduce((a, b) => a + b, 0) / row.length).toFixed(2);
                const range = (max - min).toFixed(2);
                return `<tr>
                    <td>${names[i]}</td>
                    <td>${conformity[i]}%</td>
                    <td>${avg}</td>
                    <td>${range}</td>
                </tr>`;
            }).join('')}
        </tbody>`;
    
    const chartDiv = document.getElementById('chart');
    chartDiv.innerHTML = '';
    chartDiv.appendChild(results);
}
