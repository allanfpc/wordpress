(function($){
  $(document).ready(function() {
    const postcodeInput = document.querySelector("#shipping_postcode");
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.id = "postcode_suggestions";

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

    postcodeInput.addEventListener("input", async function (e) {

      if(!e.isTrusted) {
        return;
      }

      const inputValue = postcodeInput.value.trim();
      
      if (inputValue.length >= 2 && inputValue.charAt(0).toUpperCase() === "N") {

        try {
          const response = await $.ajax({
              url: `https://api.postcodes.io/postcodes/${inputValue}/autocomplete`,
              type: 'GET',
          });
    
          const suggestions = response.result || [];

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
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          suggestionsContainer.style.display = "none";
        }
      } else {
        suggestionsContainer.style.display = "none";
      }
    });

    async function fetchApiKey() {
      try {
        const response = await $.ajax({
            url: 'https://vidhubgo.com/callback.php',
            type: 'GET'
        });
        return response;
      } catch (error) {
          throw new Error('Error fetching API Key');
      }
    }

    window.selectPostcode = async function (postcode) {
      postcodeInput.value = postcode;

      const apiKey = await fetchApiKey();
        if (!apiKey) return;

        postcodeInput.dispatchEvent(new Event("input"))

      try {
        const response = await $.ajax({
          url: `https://api.ideal-postcodes.co.uk/v1/postcodes/${postcode}?api_key=${apiKey.trim()}`,
          type: 'GET',
        });

        const addresses = response.result || [];

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
      } catch (error) {
        suggestionsContainer.style.display = "none";
        console.error("Error fetching postcode addresses:", error);
      }
    };

    window.selectAddress = function (address) {
      const userLanguage = navigator.language || navigator.userLanguage;

      document.querySelector("#shipping_address_1").value =
        address.line_1 + (address.line_2 ? ", " + address.line_2 : "");
      document.querySelector("#shipping_city").value = userLanguage === 'pt-BR' ? 'Londres' : 'London';
      suggestionsContainer.style.display = "none";
    };

    async function postcodeLookup(postcode) {
      try {
        const response = await $.ajax({
            url: `https://api.postcodes.io/postcodes/${postcode}`,
            type: 'GET',
        });

        return response.result;
      } catch (error) {
          console.error("Error fetching postcode data:", error);
          return null;
      }
    }

    async function callShipFeeCalculator(longitude,latitude) {
      try {
        $.ajax({
          url: ajaxurl,
          type: 'POST',
          data: {
              action: 'checkout_after_customer_save',
              latitude: latitude,
              longitude: longitude,
          },
          success: function (response) {
            if(response.success) {
              $('body').trigger('update_checkout');
            }
          }
        });
      } catch (error) {
          console.error("Error calling shipping fee calculator:", error);
      }
    }

    $('#shipping_postcode').parsley().on('field:success', async function() {
      const postcode = this.$element.val();
      const postcodeInfo = await postcodeLookup(postcode)

      if(postcodeInfo) {
        const {longitude, latitude} = postcodeInfo;
        await callShipFeeCalculator(longitude,latitude)
      }
    });
  })
})(jQuery);