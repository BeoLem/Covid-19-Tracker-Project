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
    const vietnamDatas = fetchedDatas.VN;
    const globalDatas = fetchedDatas.GLOBAL;

    // Datas

    const VNCitiesData = vietnamDatas.locations.sort((a, b) => b.cases - a.cases)
    const globalData = globalDatas
        .filter(v => Number.parseInt(v.infected) && Number.parseInt(v.deceased) && Number.parseInt(v.recovered))
        .sort()

    const firstCountryRender = async () => {
        const overviewIn7Days = []

        for (let i = 0; i < vietnamDatas.overview.length; i++) {
            overviewIn7Days.push({
                date: vietnamDatas.overview[i].date,
                cases: vietnamDatas.overview[i].cases,
                deaths: vietnamDatas.overview[i].death,
                recovered: vietnamDatas.overview[i].recovered,
            })
        }

        const dates = overviewIn7Days.map(item => item.date)
        const cases = overviewIn7Days.map(item => item.cases)
        const deaths = overviewIn7Days.map(item => item.deaths)
        const recovered = overviewIn7Days.map(item => item.recovered)
        const averageCases = Math.floor(cases.reduce((acc, cur) => acc + cur, 0) / cases.length)

        const firstCountry = document.querySelector(".first_country")
        if (!firstCountry.classList.contains("vietnam")) return alert("Web đã bị thay đổi giá trị ban đầu! Vui lòng nhấn OK để tải lại trang")

        const overviewRender = () => {
            const totalCasesNumber = document.querySelector("#total_cases_number_first")
            totalCasesNumber.innerHTML = `<p class="number" id="total_cases_number_first">${formatNumber(vietnamDatas.infected)}</p>`

            const deathCasesNumber = document.querySelector("#death_cases_number_first")
            deathCasesNumber.innerHTML = `<p class="number" id="death_cases_number_first">${formatNumber(vietnamDatas.died)}</p>`

            const recoveredCasesNumber = document.querySelector("#recovered_cases_number_first")
            recoveredCasesNumber.innerHTML = `<p class="number" id="recovered_cases_number_first">${formatNumber(vietnamDatas.recovered)}</p>`
        }

        overviewRender()
    }

    const secondCountryRender = async() => {
        let secondCountrySelect = document.querySelector(".second_country form select")
        let submitFormBtn = document.querySelector("#form_submit_button")
        for(let i = 0; i < globalData.length; i++) {
            const countryData = globalData[i]
            countryData["value"] = countryData.country.toLowerCase().replace(" ", "_")
            secondCountrySelect.innerHTML += `<option value="${countryData["value"]}">${countryData.country}</option>`
        }

        submitFormBtn.addEventListener("click", () => {
            const value = secondCountrySelect.value;
            if(value == "choose") return alert("Vui lòng chọn một quốc gia để so sánh!");
            const country_name = value.replaceAll("_", " ")

            const country = globalData.find((v) => v.country.toLowerCase() == country_name)
            console.log(country)

            if(!country) return alert("Không thể tìm thấy dữ liệu của nước này! Vui lòng chọn một quốc gia khác.")

            const totalCasesNumber = document.querySelector("#total_cases_number_second")
            totalCasesNumber.innerHTML = `<p class="number" id="total_cases_number_first">${formatNumber(country.infected)}</p>`

            const deathCasesNumber = document.querySelector("#death_cases_number_second")
            deathCasesNumber.innerHTML = `<p class="number" id="death_cases_number_second">${formatNumber(country.deceased)}</p>`

            const recoveredCasesNumber = document.querySelector("#recovered_cases_number_second")
            recoveredCasesNumber.innerHTML = `<p class="number" id="recovered_cases_number_second">${formatNumber(country.recovered)}</p>`
        })
    }

    firstCountryRender()
    secondCountryRender()

}

render()