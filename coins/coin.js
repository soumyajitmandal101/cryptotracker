const coinContainer = document.getElementById("coin-container");
const shimmerContainer = document.querySelector(".shimmer-container");
const coinImage = document.getElementById("coin-image");
const coinName = document.getElementById("coin-name");
const coinDescription = document.getElementById("coin-description");
const coinRank = document.getElementById("coin-rank");
const coinPrice = document.getElementById("coin-price");
const coinMarketCap = document.getElementById("coin-market-cap");
const ctx = document.getElementById("coinChart");

const buttonContainer = document.querySelectorAll(".button-container button");

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-irhs12bFULcXfsensqPHFhhx", //"CG-mDWqLm5xBDjvcVq523LnAmB",
    },

};

const urlParam = new URLSearchParams(window.location.search);
const coinId = urlParam.get("id");

const fetchCoinData = async () => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = await response.json();
        displayCoinsData(coinData);
        //return  coinData;
    } catch (error) {
        console.log("Error while fetching coin data", error);
    }
};

const displayCoinsData = (coinData) => {
    coinImage.src = coinData.image.large;
    coinImage.alt = coinData.name;
    coinDescription.textContent = coinData.description.en.split(",")[0];
    coinRank.textContent = coinData.market_cap_rank;
    coinName.textContent = coinData.name;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`

};



const coinChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Price (USD)',
            data: [],
            borderWidth: 1,
            borderColor: "#eebc1d",
            fill: false,
        },],

    },
});


const fetchChartData = async (days) => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`, options);
        const chartData = await response.json();
        updateChart(chartData.prices);

    } catch (error) {
        console.log("Error while fetching data data", error);
    }
}


const updateChart = async (prices) => {
    const data = prices.map((price) => price[1]);
    const labels = prices.map((price) => {
        const date = new Date(price[0]);
        return date.toLocaleDateString();
    });
    coinChart.data.labels = labels;
    coinChart.data.datasets[0].data = data;
    coinChart.update();
}


buttonContainer.forEach((button) => {
    button.addEventListener("click", (event) => {
        const days = event.target.id === "24h" ? 1 : event.target.id === "30d" ? 30 : 90;
        fetchChartData(days);
    });

});


document.addEventListener("DOMContentLoaded", async () => {
    await fetchCoinData();

    document.getElementById("24h").click();
});