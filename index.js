const input = document.querySelectorAll("input");
const submitButton = document.querySelector("#submit-btn");
const priceButton = document.querySelector(".current-price");
const priceContainer = document.querySelector(".show-current-price");
const outputContainer = document.querySelector(".output");
const gifContainer = document.querySelector("#gif-container");
const spanColor = document.querySelector(".output");
const SERVER_URL =
  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=FGSONR9A73AEHCUF";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];
let price;
let date;

priceButton.addEventListener("click", async () => {
  input[2].style.display = "none";
  try {
    let response = await fetch(SERVER_URL);
    let data = await response.json();
    let firstDate = Object.keys(data["Time Series (Daily)"])[0];
    date = firstDate.split("-");
    price = Number(data["Time Series (Daily)"][firstDate]["1. open"]);
    priceContainer.innerHTML = `<p>Current Price as of ${months[date[1] - 1]} ${
      date[2]
    } is <span>${price}</span45a52f></p>`;
    return price;
  } catch (err) {
    console.log(err);
  }
});

submitButton.addEventListener("click", () => {
  const initialPrice = Number(input[0].value);
  const quantity = Number(input[1].value);
  const currentPrice = Number(input[2].value) | price;

  if (initialPrice > 0 && quantity > 0 && currentPrice > 0) {
    calculateProfitAndLoss(initialPrice, quantity, currentPrice);
  } else {
    outputContainer.innerHTML = `Please Enter positive values.`;
    gifContainer.innerHTML = "";
  }
});

function calculateProfitAndLoss(initial, quantity, current) {
  if (initial > current) {
    let loss = (initial - current) * quantity;
    let lossPercentage = (loss / initial) * 100;
    showOutput("loss", loss, lossPercentage, "rgba(161, 37, 37, 0.5)");

    if (lossPercentage > 50) {
      showOutput("loss", loss, lossPercentage, "red");
    }
    gifContainer.innerHTML = showGif("https://giphy.com/embed/2rtQMJvhzOnRe");
  } else if (current > initial) {
    let profit = (current - initial) * quantity;
    let profitPercentage = (profit / initial) * 100;

    showOutput("profit", profit, profitPercentage, "green");
    gifContainer.innerHTML = showGif(
      "https://giphy.com/embed/26tPplGWjN0xLybiU"
    );
  } else {
    showOutput(`<p>Neither safe nor secure</p>`);
  }
}

function showGif(URL) {
  return `<iframe
  src=${URL}
  width="300"
  frameborder="0"
  class="giphy-embed"
  allowfullscreen
  ></iframe>`;
}
function showOutput(message, value, percentValue, color) {
  outputContainer.innerHTML = `<p>Your ${message} is <span>${value.toFixed(
    2
  )}</span> and the percent is <span>${percentValue.toFixed(2)}%</span></p>`;
  spanColor.style.color = color;
}

