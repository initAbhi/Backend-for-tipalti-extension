import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json()); // Parse JSON bodies

app.get("/", (req, res) => {
  res.send("Running...");
});

app.post("/", async (req, res) => {
  const cookies = req.body.cookies;
  const cRVT = req.body.cRVT;
  const idap = req.body.idap;

  console.log("Received cookies:", cookies);
  console.log("Received C-RVT:", cRVT);

  const resp = await fetch(
    "https://hub.tipalti.com/api/v0/PayeeInfo/PayableStatusReasons",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        baggage:
          "sentry-environment=PROD,sentry-release=dashboard-single-spa.20250326.29,sentry-public_key=6751b2dc7285436d91497c835b88b53d,sentry-trace_id=b49ade55a85b433f810e8a5f020e76bc,sentry-replay_id=05c9554cd4f84e1cbda5516a4606c54e,sentry-sample_rate=0.2,sentry-transaction=payee-loading%23payees-list-load,sentry-sampled=false",
        "content-type": "application/json",
        "h-rvt": `${cRVT}`,
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sentry-trace": "b49ade55a85b433f810e8a5f020e76bc-897e49f535b587ab-0",
        "x-requested-with": "XMLHttpRequest",
        cookie: `${cookies}`,
        Referer:
          "https://hub.tipalti.com/dashboard/payees/information/38af76a0-da27-46e5-a40e-92d9c15fd5a5/payments",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `{"idap":"${idap}"}`,
      method: "POST",
    }
  );

  const data = await resp.json();

  // .then((res) => res.json())
  // .then((data) => {
  //   res.status(200).json({
  //     message: "Cookies and C-RVT received successfully",
  //     data: data,
  //   });
  // });
  const PayeePaymentHistory = await fetch(
    "https://hub.tipalti.com/api/v0/PayeePaymentHistory/GetPayeePaymentHistory",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        baggage:
          "sentry-environment=PROD,sentry-release=dashboard-single-spa.20250310.19,sentry-public_key=6751b2dc7285436d91497c835b88b53d,sentry-trace_id=e24110400d4f41309053eddcc397b7aa,sentry-sample_rate=0.2,sentry-transaction=payee-loading%23payees-list-load,sentry-sampled=false",
        "content-type": "application/json;charset=UTF-8",
        "h-rvt": `${cRVT}`,
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sentry-trace": "e24110400d4f41309053eddcc397b7aa-ae8d86940fb55293-0",
        "x-requested-with": "XMLHttpRequest",
        cookie: `${cookies}`,
        Referer:
          "https://hub.tipalti.com/dashboard/payees/information/3e8d21dd-9950-4e1e-824e-4f741684c5e2/payments",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `{\"idap\":\"${idap}\",\"pagingData\":{\"PageCount\":1,\"PageSize\":10}}`,
      method: "POST",
    }
  );
  const hisData = await PayeePaymentHistory.json();
  res.status(200).json({
    message: "Cookies and C-RVT received successfully",
    data: data,
    hisData: hisData,
  });

  // Process the cookies and C-RVT as needed
  // You can save them to a database or perform any other operations
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
