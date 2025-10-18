(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const incomingRef = urlParams.get("uid");

    if (incomingRef && !localStorage.getItem("referrer")) {
        const timestamp = Date.now();
        localStorage.setItem("referrer", incomingRef);
        localStorage.setItem("referrer_ts", timestamp.toString());

        const ip = await getInternetProtocolAddress();

        fetch("https://ref.xian.org/create-referral", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                referrer: incomingRef,
                ip: ip,
                timestamp: timestamp,
            }),
        });
    }

    async function getInternetProtocolAddress() {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    }
})();
