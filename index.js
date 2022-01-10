var express = require("express");
var LitJsSdk = require("lit-js-sdk");
var app = express();

// BEGIN by setting some application wide globals for this demo.
var randomUrlPath = null;

// which chain to use
const chain = "ethereum";

// In this example, we are checking the ETH balance of the user's address and
// making sure it's above 0.00001 ETH. Note that the return value is in Wei,
// so we specified 0.00001 ETH as 10000000000000 Wei.
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];

// get the authSig from some wallet
const authSig = {
  sig: "0x39a3d6f2bedb5ef51442069d3c721596328ef50f81a3a0c0339c2acaade8bd721fea5cce0dc4acb6958cd40fddd680fb35c1fbd07fa95c7e657f5e6f154ed7fc1b",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "I am creating an account to use Lit Protocol at 2022-01-10T20:47:35.692Z",
  address: "0xfff175c14a299ef7027da0d348f438e154880ccd",
};

// BEGIN with endpoint definitions
app.get("/store", async function (req, res) {
  // generate a random path because you can only provision access to a given path once
  // this is only done because this is a demo.  normally you would put the path of the
  // thing you are protecting
  randomUrlPath =
    "/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const resourceId = {
    baseUrl: "my-dynamic-content-server.com",
    path: randomUrlPath,
    orgId: "",
    role: "",
    extraData: "",
  };

  await app.locals.litNodeClient.saveSigningCondition({
    accessControlConditions,
    chain,
    authSig,
    resourceId,
  });

  res.send("success");
});

app.get("/retrieve_and_verify", async function (req, res) {
  const resourceId = {
    baseUrl: "my-dynamic-content-server.com",
    path: randomUrlPath,
    orgId: "",
    role: "",
    extraData: "",
  };

  const jwt = await app.locals.litNodeClient.getSignedToken({
    accessControlConditions,
    chain,
    authSig,
    resourceId,
  });

  console.log("got jwt", jwt);

  // verify the JWT
  const { verified, header, payload } = LitJsSdk.verifyJwt({ jwt });
  if (
    !verified ||
    payload.baseUrl !== "my-dynamic-content-server.com" ||
    payload.path !== randomUrlPath ||
    payload.orgId !== "" ||
    payload.role !== "" ||
    payload.extraData !== ""
  ) {
    // Reject this request!
    res.send("Error!  The JWT is invalid!");
  }

  res.send("success");
});

// BEGIN with server setup
var server = app.listen(8081, async function () {
  var host = server.address().address;
  var port = server.address().port;

  // You must store litNodeClient in some kind of global variable that
  // is accessible to all your endpoints that will interact with the Lit Network.
  // It's best to initialize it just once per server.
  app.locals.litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
  });
  await app.locals.litNodeClient.connect();

  console.log("Example app listening at http://%s:%s", host, port);
});
