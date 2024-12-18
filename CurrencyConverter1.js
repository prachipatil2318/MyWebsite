const Base_Url = "https://v6.exchangerate-api.com/v6/6cfe4543e3d22cc5756e3cc9/latest";
const Alt_Api_Url = "https://api.apilayer.com/exchangerates_data/latest?access_key=YOUR_ACCESS_KEY";


const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

const updateExchangeRate = async () => {
  try {
    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;
    let URL = `${Base_Url}/${fromCurrency}`;

    console.log("Fetching data from primary URL:", URL);

    let response = await fetch(URL);

    if (!response.ok) {
      console.warn("Primary API failed. Trying alternative API.");
      URL = `${Alt_Api_Url}&base=${fromCurrency}&symbols=${toCurrency}`;
      response = await fetch(URL);
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const rate = data.conversion_rates?.[toCurrency] || data.rates?.[toCurrency];

    if (!rate) {
      throw new Error("Currency conversion not supported or unavailable.");
    }

    const amount = document.querySelector(".amount input").value || 1;
    const finalAmount = (amount * rate).toFixed(2);
    msg.innerText = `${amount} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
  } catch (error) {
    console.error("Error:", error.message);
    msg.innerText = "Failed to retrieve the currency conversion rate. Please try again later.";
  }
};


