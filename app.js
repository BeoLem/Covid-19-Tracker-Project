// Format Number Function

const formatNumber = (number) => {
    return (Math.round(number * 100) / 100).toLocaleString();
}

// Get Datas from API
const getDatasFromAPI = async () => {
    const url = "https://api.apify.com/v2/key-value-stores/EaCBL1JNntjR3EakU/records/LATEST?disableRedirect=true"

    const datas = await (await fetch(url)).json();
    return datas;
}

const render = async () => {
    // Get Data
    const fetchedDatas = await getDatasFromAPI()
    console.log(fetchedDatas)

    // Datas

    const overviewIn7Days = []

    for (let i = 0; i < fetchedDatas.overview.length; i++) {
        overviewIn7Days.push({
            date: fetchedDatas.overview[i].date,
            cases: fetchedDatas.overview[i].cases,
            deaths: fetchedDatas.overview[i].death,
            recovered: fetchedDatas.overview[i].recovered,
        })
    }

    const dates = overviewIn7Days.map(item => item.date)
    const cases = overviewIn7Days.map(item => item.cases)
    const deaths = overviewIn7Days.map(item => item.deaths)
    const recovered = overviewIn7Days.map(item => item.recovered)
    const averageCases = Math.floor(cases.reduce((acc, cur) => acc + cur, 0) / cases.length)

    const overviewRender = () => {
        const totalCasesNumber = document.querySelector("#total_cases_number")
        totalCasesNumber.innerHTML = `<p class="number" id="total_cases_number" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${formatNumber(cases[cases.length - 1]).toString().startsWith("-") ? formatNumber(cases[cases.length - 1]) : `+${formatNumber(cases[cases.length - 1])}` } so với ngày hôm qua">${formatNumber(fetchedDatas.infected)}</p>`
        
        const deathCasesNumber = document.querySelector("#death_cases_number")
        deathCasesNumber.innerHTML = `<p class="number" id="death_cases_number" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${formatNumber(deaths[deaths.length - 1]).toString().startsWith("-") ? formatNumber(deaths[deaths.length - 1]) : `+${formatNumber(deaths[deaths.length - 1])}` } so với ngày hôm qua">${formatNumber(fetchedDatas.died)}</p>`

        const recoveredCasesNumber = document.querySelector("#recovered_cases_number")
        recoveredCasesNumber.innerHTML = `<p class="number" id="recovered_cases_number" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${formatNumber(recovered[recovered.length - 1]).toString().startsWith("-") ? formatNumber(recovered[recovered.length - 1]) : `+${formatNumber(recovered[recovered.length - 1])}` } so với ngày hôm qua">${formatNumber(fetchedDatas.recovered)}</p>`
    }

    const tooltipRender = () => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }
    
    const chartRender = () => {

        const casesChart = new Chart(
            document.getElementById('caseChart'),
            config = {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Số ca nhiễm',
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                        data: cases,
                    }],
                }
            }
        );

        const deathChart = new Chart(
            document.getElementById('deathChart'),
            config = {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Số ca tử vong",
                        backgroundColor: 'red',
                        borderColor: 'red',
                        data: deaths,
                    }],
                }
            }
        );

        const recoveredChart = new Chart(
            document.getElementById('recoveredChart'),
            config = {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Số ca khỏi",
                        backgroundColor: 'green',
                        borderColor: 'green',
                        data: recovered,
                    }],
                }
            }
        );
    }

    overviewRender()
    tooltipRender()
    chartRender()

}

render()