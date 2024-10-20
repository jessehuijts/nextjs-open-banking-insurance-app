import {
  createHash,
  createSign,
  randomUUID,
  X509Certificate,
} from "node:crypto";
import * as fs from "fs";

function sha512(content) {
  return createHash("sha512").update(content).digest("base64");
}

function createSigningString(headers) {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function makeKeyValueString(entries: object) {
  return Object.entries(entries)
    .map(([key, value]) => `${key}=${value}`)
    .join(",");
}

function makeKeyValueSignatureString(entries: object) {
  return Object.entries(entries)
    .map(([key, value]) => `${key}="${value}"`)
    .join(",");
}

function getSerialNumber() {
  const x509 = new X509Certificate(
    fs.readFileSync("/var/task/certificates/cert.pem")
  );
  return parseInt(x509.serialNumber, 16);
}

const privateKey = fs.readFileSync("/var/task/certificates/key.pem", "utf-8");

function generateDigitalSignature(data: string) {
  const sign = createSign("RSA-SHA512");
  sign.update(data);
  return sign.sign(privateKey, "base64");
}

interface StepFunctionHandlerEvent {
  event: {
    description: string;
    amount: number;
    creditorIban: string;
    creditorName: string;
    signatureHeader: string;
    requestId: string;
    date: string;
    digest: string;
    payoutBody: object;
  };
}

const signingMiddleware = () => {
  const signingMiddlewareBefore = async (request: StepFunctionHandlerEvent) => {
    const { amount, description, creditorIban, creditorName } = request.event;

    const endToEndIdentification = randomUUID();

    const uniqueRequestorReference = randomUUID();

    const payoutBody = {
      creditorAccount: { currency: "EUR", iban: creditorIban },
      creditorAddress: {
        buildingNumber: "8",
        country: "NL",
        postcode: "2456RL",
        streetName: "Utrechtstraat",
        townName: "Utrecht",
      },
      creditorAgent: "RABONL2U",
      creditorName,
      remittanceInformationStructured: {
        reference: description,
        referenceIssuer: "CUR",
      },
      debtorAccount: { currency: "EUR", iban: "NL43RABO9012918502" },
      debtorAgent: "RABONL2U",
      debtorName: "Allen Martin",
      endToEndIdentification: endToEndIdentification.slice(0, 35),
      instructedAmount: { content: String(amount), currency: "EUR" },
      urgencyIndicator: false,
      uniqueRequestorReference,
    };

    request.event.payoutBody = payoutBody;

    const digest = sha512(JSON.stringify(payoutBody));

    const digestObject = {
      "sha-512": digest,
    };

    const digestString = makeKeyValueString(digestObject);

    request.event.digest = digestString;

    const date = new Date().toUTCString();

    request.event.date = date;

    const requestId = randomUUID();

    request.event.requestId = requestId;

    const signingObject = {
      date,
      digest: digestString,
      "x-request-id": requestId,
    };

    const signingString = createSigningString(signingObject);

    const signedPayload = generateDigitalSignature(signingString);

    const signatureHeaderObject = {
      keyId: getSerialNumber(),
      algorithm: "rsa-sha512",
      headers: "date digest x-request-id",
      signature: signedPayload,
    };

    const signatureHeader = makeKeyValueSignatureString(signatureHeaderObject);

    request.event.signatureHeader = signatureHeader;
  };

  return {
    before: signingMiddlewareBefore,
  };
};

export default signingMiddleware;
