# Lit Only Serverside SDK Example

This is an example of how to use the Lit JS SDK in a fully server-side environment.

## Important

The most important thing you need to know is that if you're in a nodejs env, you need to import the node specific package and then everything should just work:

Either `var LitJsSdk = require("lit-js-sdk/build/index.node.js")`

Or `import LitJsSdk from "lit-js-sdk/build/index.node.js"`

## How this works

This example is a simple server that uses the Lit SDK to create a server-side Lit instance and store it in `app.locals.litNodeClient`. This example uses the Express framework but the lit-js-sdk can be used with any framework. To use it with another framework, you just need to store the connected `litNodeClient` in some kind of global object, which will be different for each framework. In Express this global object is `app.locals`.

## Usage

Run `yarn` to install the dependencies. Then run `yarn start` to start the server.

In another terminal, run `curl http://localhost:8081/store` to store a condition. You can then run `curl http://localhost:8081/retrieve_and_verify` to retrieve a signed JWT based on the condition, and verify it.

## Notes

The authSig in this example is hardcoded. In production, you will need to generate your authSig using your own wallet. You should generate the authSig every time you interact with the Lit Protocol because the signatures do expire.
