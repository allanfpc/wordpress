<script>
	
		document.addEventListener("DOMContentLoaded", function () {
  const postcodeInput = document.querySelector("#shipping_postcode");
  const suggestionsContainer = document.createElement("div");
  suggestionsContainer.id = "postcode_suggestions";
  let longitude, latitude;

  Object.assign(suggestionsContainer.style, {
    position: "absolute",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    width: `${postcodeInput.offsetWidth}px`,
    borderRadius: "4px",
    zIndex: "9999",
    display: "none",
    maxHeight: "200px",
    overflowY: "auto",
  });
  postcodeInput.parentElement.insertAdjacentElement(
    "afterend",
    suggestionsContainer
  );

  postcodeInput.addEventListener("input", function () {
    const inputValue = postcodeInput.value.trim();

    if (inputValue.length >= 2 && inputValue.charAt(0).toUpperCase() === "N") {
      fetch(`https://api.postcodes.io/postcodes/${inputValue}/autocomplete`)
        .then((response) => response.json())
        .then((data) => {
          const suggestions = data.result || [];
          if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = "";

            suggestions.forEach((postcode) => {
              const item = document.createElement("div");
              item.style.cssText = `
                                display: flex;
                                align-items: center;
                                padding: 10px;
                                cursor: pointer;
                                border-bottom: 1px solid #ddd;
                                gap: 10px;`;

              item.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" fill-rule="evenodd" d="M11.262 22.134S4 16.018 4 10a8 8 0 1 1 16 0c0 6.018-7.262 12.134-7.262 12.134c-.404.372-1.069.368-1.476 0M12 13.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7"/>
                                </svg>
                                <div><strong style="font-size: 16px; color: #333;">${postcode}</strong><span></span></div>`;

              item.addEventListener("click", function () {
                selectPostcode(postcode);
              });

              suggestionsContainer.appendChild(item);
            });

            suggestionsContainer.style.top = "55px";
            suggestionsContainer.style.left = "5px";
            suggestionsContainer.style.display = "block";

            document.addEventListener("click", function (e) {
              if (!suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = "none";
              }
            });
          } else {
            suggestionsContainer.style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar sugestões:", error);
          suggestionsContainer.style.display = "none";
        });
    } else {
      suggestionsContainer.style.display = "none";
    }
  });

  window.selectPostcode = function (postcode) {
    postcodeInput.value = postcode;

    postcodeInput.dispatchEvent(new Event("input"));

    fetch(
      `https://api.ideal-postcodes.co.uk/v1/postcodes/${postcode}?api_key=ak_m867c38yUg1QlKQwkfPZNa0oMdhWx`
    )
      .then((response) => response.json())
      .then((data) => {
        const addresses = data.result || [];

        if (addresses.length > 0) {
          suggestionsContainer.innerHTML = "";

          addresses.forEach((address) => {
            const item = document.createElement("div");
            item.style.cssText = `
                            display: flex;
                            flex-direction: column;
                            padding: 10px;
                            cursor: pointer;
                            border-bottom: 1px solid #ddd;
                            gap: 10px;`;

            item.innerHTML = `
                            <strong style="font-size: 16px; color: #333;">${address.line_1}, ${address.line_2}</strong>
                            <span style="font-size: 14px; color: #555;">${address.post_town}, ${address.postcode}</span>`;

            item.addEventListener("click", function () {
              selectAddress(address);
            });

            suggestionsContainer.appendChild(item);
          });

          suggestionsContainer.style.top = "55px";
          suggestionsContainer.style.left = "5px";
          suggestionsContainer.style.display = "block";
        } else {
          suggestionsContainer.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar endereços:", error);
        suggestionsContainer.style.display = "none";
      });
  };

  window.selectAddress = function (address) {
    document.querySelector("#shipping_address_1").value =
      address.line_1 + (address.line_2 ? ", " + address.line_2 : "");
    document.querySelector("#shipping_city").value = address.post_town;
    console.log(
      `Endereço selecionado: ${address.line_1}, ${address.line_2}, ${address.post_town}, ${address.postcode}`
    );
    latitude = address.latitude;
    longitude = address.longitude;
    console.log(latitude, longitude);

    suggestionsContainer.style.display = "none";
  };

  window.Parsley.on("field:success", function () {
    if (this.$element[0].id !== "shipping_postcode") {
      return;
    }

    const postcode = this.$element[0].value;
    fetch(`https://api.postcodes.io/postcodes/${postcode}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data: ", data);
        if (data) {
          latitude = data.result.latitude;
          longitude = data.result.longitude;
          console.log(latitude, longitude);
          
        }
      });
  });
});

</script>
