export function fetchCrypto() {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(cryptoData);
  //   }, 2000);
  // });
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "WzmBNZoTMnCR1Qdl/O8nWY6MWzpKm3/zwCwciYcSGqU=",
    },
  };

  return fetch("https://openapiv1.coinstats.app/coins?limit=1000", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Error:", err);
      return null;
    });
}
