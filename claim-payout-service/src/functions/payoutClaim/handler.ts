import { Handler } from "aws-lambda";
import middy from "@middy/core";
import signingMiddleware from "@libs/signing";
import * as fs from "fs";
import * as https from "https";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface Event {
  name: string;
  amount: number;
  iban: string;
  signatureHeader: string;
  requestId: string;
  date: string;
  digest: string;
  endToEndReference: string;
  uniqueRequestorReference: string;
  payoutBody: object;
}

const payoutClaim: Handler = async (event: Event) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    Date: event.date,
    Digest: event.digest,
    "PSU-IP-Address": "127.0.0.1",
    Signature: event.signatureHeader,
    "Signature-Certificate": process.env.CERTIFICATE,
    "x-ibm-client-id": process.env.CLIENT_ID,
    "x-request-id": event.requestId,
  };

  console.log("headers", headers);

  console.log("body", event.payoutBody);

  const options: AxiosRequestConfig = {
    url: "https://api-sandbox.rabobank.nl/openapi/sandbox/bip/v3/payments/single-credit-transfers",
    headers: headers,
    method: "post",
    data: event.payoutBody,
  };

  const instance = axios.create({
    httpsAgent: new https.Agent({
      key: fs.readFileSync("/var/task/certificates/key.pem"),
      cert: fs.readFileSync("/var/task/certificates/cert.pem"),
    }),
  });
  try {
    const { data } = await instance(options);
    console.log(data);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response) {
        console.log(e.response.data, "error response");
        console.log(e.response.status, "error status");
        console.log(e.response.headers, "error headers");
      } else if (e.request) {
        console.log(e.request);
      } else {
        console.log("Error", e.message);
      }
    }
    throw e;
  }
};

export const main = middy(payoutClaim).use(signingMiddleware());
