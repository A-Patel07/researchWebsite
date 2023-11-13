async function getData() {
    const response = await fetch('/researchWebsite/data/Research-Site-Data.csv');
    const data = await response.text();     //CSV  is in TEXT format

    const xWeeks = []; //x-axis labels = weeks after input data values
    const yActual = []; //y-axis actual TSI values
    const yCalculated = []; //y-axis calculated values

    // \n - new line charcter
    // split('\n') will seperate table into  an array of individual rows
    //slice(start,end) - return a new array starting at index start and up to but noy including index end
    const table = data.split('\n').slice(1);
    console.log(table);

    table.forEach(row=>{
        const columns = row.split(','); //split each row on the commas
        const week = columns[0];        //assign year value
        xWeeks.push(week);              //push year value into xYears arary

        const actual = parseFloat(columns[1]);   //assign temp values
        yActual.push(actual);         //push temp values + 14 to store mean temp values

        const calculated = parseFloat(columns[2]);   //assign nh temp values
        yCalculated.push(calculated);         //push nh temp values + 14 to store mean temp values

    });
    return {xWeeks, yActual, yCalculated};
}

async function createChart(){
    const data = await getData(); 
    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.xWeeks,
            datasets: [
                {
                    label: `Actual TSI Value`,
                    data: data.yActual,
                    fill: false,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 2,
                },
                {
                    label: `Calculated TSI Value`,
                    data: data.yCalculated,
                    fill: false,
                    backgroundColor: 'rgba(0,102,255,0.2)',
                    borderColor: 'rgba(0,102,255,1)',
                    borderWidth: 2,
                },
            ]
        },
        options: {
            responsive: true, //Re-size based on screen size
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Weeks After Input Data',
                        font: {
                            size: 20
                        },
                        color: '#black',
                    },
                    ticks: {
                        callback: function(val, index){
                            return index % 5 === 0 ? this.getLabelForValue(val) : "";
                        },
                        font: {
                            size: 16
                        }
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'TSI Value',
                        font: {
                            size: 20
                        },
                        color: '#black',
                        padding: {
                            top: 20,
                            bottom: 10,
                        }
                    },
                    ticks: {
                        maxTicksLimit: data.yActual.length/10,  //limit # of ticks
                        font: {
                            size: 12
                        }
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Actual vs Calculated Trophic State Index (TSI) Values',
                    font: {
                        size: 24
                    },
                    color: '#black',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    align: 'start',
                    position: 'bottom'
                }
            }
        }
    });
}

createChart();