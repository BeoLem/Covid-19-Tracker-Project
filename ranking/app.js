// Format Number Function

const formatNumber = (number) => {
    return (Math.round(number * 100) / 100).toLocaleString();
}

// Get Datas from API
const getDatasFromAPI = async () => {
    const vietnam_api = "https://api.apify.com/v2/key-value-stores/EaCBL1JNntjR3EakU/records/LATEST?disableRedirect=true"
    const global_api = "https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true"

    const vietnam_datas = await (await fetch(vietnam_api)).json();
    const global_datas = await (await fetch(global_api)).json();

    return {
        VN: vietnam_datas,
        GLOBAL: global_datas
    };
}

const render = async () => {
    // Get Data
    const fetchedDatas = await getDatasFromAPI()
    console.log(fetchedDatas)
    const vietnamDatas = fetchedDatas.VN;
    const globalDatas = fetchedDatas.GLOBAL;

    // Datas
    const VNCitiesData = vietnamDatas.locations.sort((a, b) => b.cases - a.cases)
    const globalData = globalDatas
        .filter(v => ["NA", "0", "null"].includes(v.infected) || v.infected)
        .sort((a, b) => b.infected - a.infected)

    const tableRender = () => {
        const VNDailyTableBody = document.querySelector(".vietnam_table_body")
        for (let cityIndex in VNCitiesData) {
            const cityData = VNCitiesData[cityIndex]
            VNDailyTableBody.innerHTML += `<tr><th class="number">${++cityIndex}</th><th class="city">${cityData.name}</th><th class="total">${cityData.cases}</th><th class="cases_yesterday">${cityData.casesToday}</th><th class="death">${cityData.death}</th></tr>`
        }

        const globalDailyTableBody = document.querySelector(".global_table_body")
        for (let countryIndex in globalData) {
            const countryData = globalData[countryIndex]
            globalDailyTableBody.innerHTML += `<tr><th class="number">${++countryIndex}</th><th class="country">${countryData.country}</th><th class="total">${countryData.infected}</th><th class="death">${countryData.deceased || "NA"}</th><th class="recovered">${countryData.recovered || "NA"}</th></tr>`
        }

    }

    tableRender()

}

render()