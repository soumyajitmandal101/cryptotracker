
const shimmerContainer = document.querySelector(".shimmer-container");
const paginationContainer = document.getElementById("pagination");

const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDsc = document.getElementById("sort-price-desc");

const sortVolumeAsc = document.getElementById("sort-volume-asc");
const sortVolumeDsc = document.getElementById("sort-volume-desc");

const searchBox = document.getElementById("search-box");


const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo--api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB"
    },
};

let coins = [];
let itemsPerPage = 15;
let currentPage = 1;


const fetchCoins = async () => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=markat_cap_desc&per_page=100&page=1", options);
        coinsData = await response.json();
        //console.log("coins=", coinsData);
        return coinsData;
    } catch (error) {
        console.log("Error While Fetching Coins", error);
    }
}

const fetchFavoriteCoins = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

const saveFavoriteCoins = (favorites) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

const handleFavClick = (coinId) => {

    //console.log("element.dataset.id=", element.dataset.id);

    // shimmerContainer.style.display = "flex";
    let favorites = fetchFavoriteCoins();
    if (favorites.includes(coinId)) {
        favorites = favorites.filter((id) => {
            //console.log("id=", id, "element.dataset.id=", element.dataset.id, " ", id != element.dataset.id);
            return id !== coinId;
        });
        console.log("favorites=", favorites);
    } else {
        favorites.push(coinId);
    }
    saveFavoriteCoins(favorites);
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);

}


//-----------------Sor Price--------------
const sortCoinsByPrice = (order) => {

    if (order === "asc") {
        coins.sort((a, b) => a.current_price - b.current_price);
    } else if (order === "desc") {
        coins.sort((a, b) => b.current_price - a.current_price);
    }
    currentPage = 1;
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
    renderPagination(coins);
}

sortPriceAsc.addEventListener('click', () => {
    sortCoinsByPrice('asc')
});

sortPriceDsc.addEventListener('click', () => {
    sortCoinsByPrice('desc')
});



//----------------Sort Volume------------------
const sortCoinsByVolume = (order) => {
    if (order === "asc") {
        coins.sort((a, b) => a.total_volume - b.total_volume);
    } else if (order === "desc") {
        coins.sort((a, b) => b.total_volume - a.total_volume);
    }
    currentPage = 1;
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
    renderPagination(coins);
}

sortVolumeAsc.addEventListener('click', () => {
    sortCoinsByVolume('asc')
});

sortVolumeDsc.addEventListener('click', () => {
    sortCoinsByVolume('desc')
});



//----------------Search Coins---------------
const handleSearch = () => {

    console.log("--------------Search--------------");
    const searchQuery = searchBox.value.trim();
    const filteredCoins = coins.filter((coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    currentPage = 1;
    displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
    renderPagination(filteredCoins);

}


searchBox.addEventListener('input', handleSearch)





//--------------open/close shimmer loader-------------
hidedShimmer = () => {
    shimmerContainer.style.display = "none";
}

showShimmer = () => {
    shimmerContainer.style.display = "flex";
}

const getCoinsToDisplay = (coins, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return coins.slice(start, end);
}

const displayCoins = (coins, currentPage) => {
    const start = (currentPage - 1) * itemsPerPage + 1;

    const favorites = fetchFavoriteCoins();
    //console.log("favorites=", favorites);


    const tableBody = document.getElementById("crypto-table-body");

    tableBody.innerHTML = "";

    coins.forEach((coin, index) => {
        const row = document.createElement("tr");
        const isFavorite = favorites.includes(coin.id);
        //console.log("isFavorite=", isFavorite);
        row.innerHTML = `
    <td>${start + index}</td>
    <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24" />
    <td>${coin.name}</td>
    <td>$${coin.current_price.toLocaleString()}</td>
    <td>$${coin.total_volume.toLocaleString()}</td>
    <td>$${coin.market_cap.toLocaleString()}</td>
    <td><i class="fa-solid fa-star favourite-icon ${isFavorite ? "favorite" : ""}" data-id="${coin.id}" >
    </i></td>
    `;

        row.addEventListener('click', () => {
            //window.open(`./coins/coin.html?id=${coin.id}`, "_blank");
            window.open(`../coins/coin.html?id=${coin.id}`, "_blank");
        })

        //onclick="handleFavClick(this)"
        row.querySelector(".favourite-icon").addEventListener("click", (event) => {
            event.stopPropagation();
            handleFavClick(coin.id);

        });

        tableBody.appendChild(row);
    })
};

const renderPagination = (coins) => {
    const totalPage = Math.ceil(coins.length / itemsPerPage);
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add("page-button");

        if (i === currentPage) {
            pageBtn.classList.add("active");
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
            updatePaginationButton();
        })

        paginationContainer.appendChild(pageBtn);
    }

}

const updatePaginationButton = () => {
    const pageBtns = document.querySelectorAll(".page-button");
    pageBtns.forEach((button, index) => {
        if (index + 1 === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove("active");
        }
    })
}

document.addEventListener("DOMContentLoaded", async () => {

    try {
        showShimmer();
        coins = await fetchCoins();
        // console.log(coins);
        // displayCoins(coins);
        displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
        renderPagination(coins);
        hidedShimmer();

    } catch (error) {
        console.log("Error While Fetching Coins", error);
        hidedShimmer();
    }
});
