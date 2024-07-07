
const shimmerContainer = document.querySelector(".shimmer-container");
// const searchBox = document.getElementById("search-box");

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo--api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB"
    },
};


const getFavoriteCoins = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}


const fetchFavoriteCoins = async (coinIds) => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}`, options);
        coinsData = await response.json();
        //console.log("coins=", coinsData);
        return coinsData;
    } catch (error) {
        console.log("Error While Fetching Coins", error);
    }
}



//--------------open/close shimmer loader-------------
hidedShimmer = () => {
    shimmerContainer.style.display = "none";
}

showShimmer = () => {
    shimmerContainer.style.display = "flex";
}


const displayFavoriteCoins = (favCoins) => {
    const tableBody = document.getElementById("favorite-table-body");
    tableBody.innerHTML = "";

    favCoins.forEach((coin, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>${index + 1}</td>
    <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24" />
    <td>${coin.name}</td>
    <td>$${coin.current_price.toLocaleString()}</td>
    <td>$${coin.total_volume.toLocaleString()}</td>
    <td>$${coin.market_cap.toLocaleString()}</td>
    `;

        row.addEventListener('click', () => {
            window.open(`../coins/coin.html?id=${coin.id}`, "_blank");
        })

        tableBody.appendChild(row);
    })

}

document.addEventListener("DOMContentLoaded", async () => {

    try {
        showShimmer();
        const favorites = getFavoriteCoins();
        if (favorites.length > 0) {
            const favoritesCoins = await fetchFavoriteCoins(favorites);
            console.log("favoritesCoins=", favoritesCoins);
            displayFavoriteCoins(favoritesCoins);
        } else {
            // displayFavoriteCoins([]);
            const noFavMsg = document.getElementById("no-favorites");
            noFavMsg.style.display = "block";
        }
        //renderPagination(coins);
        hidedShimmer();

    } catch (error) {
        console.log("Error While Fetching Coins", error);
        hidedShimmer();
    }
});




// //----------------Search Coins---------------
// const handleSearch = () => {

//     console.log("--------------Search--------------");
//     const searchQuery = searchBox.value.trim();
//     const filteredCoins = coins.filter((coin) =>
//         coin.name.toLowerCase().includes(searchQuery.toLowerCase())
//     )

//     currentPage = 1;
//     displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
//     renderPagination(filteredCoins);

// }

// searchBox.addEventListener('input', handleSearch)
