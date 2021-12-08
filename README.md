# Unlock-protocol + Sveltekit

Elevate your SaaS product to login with metamask, firebase and paywall customers with [unlock-protocol](https://unlock-protocol.com/).

## Features

- Use Metamask to login via firebase.
- Uses both firebase-admin and firebase v9.
- Firebase [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) for access to database.
- Dockerized application.

## Setup

Clone repo, `npm i` | `pnpm i`.

Add `serviceaccount.json` obtained from firebase console -> Project settings -> Service accounts -> Generate new private and encode to base64 using any of these commands.

- `openssl base64 < serviceaccount.json -A | xclip -sel clipboard` paste contents of this file to `.env` on mac use `pbcopy` instead of `xclip`.
- `openssl base64 -in serviceaccount.json -out encoded_serviceaccount.txt -A` copy contents of this file to `.env` and **do not** commit the `txt` file.

Replace contents of `contract.abi.json` that you can get from [etherscan](https://rinkeby.etherscan.io/address/0x3f496D438aE2520ee839f3909ECeCcA40B4B22D3#code) of your deployed contract.

Add `firebaseConfig` from firebase console -> Project settings -> General (scroll down to your apps) to `src/lib/constants.ts`

Add a JSON-RPC API provider from infura.io or alchemyapi.io to `.env`.

## Usage

`pnpm dev` use metamask with `RINKEBY` as your network once you pay the key for unlock you will be able to fetch the data from firebase or you will get 403 Permission errors.

- The sample app requests the client to switch to rinkeby network.

## Sanity Checks and prerequisites.

- Have firestore enabled on firebase.
- Have anonymous/Google provider login enabled on authentication on firebase.
- The `firebase-admin` package isn't friendly with serverless environment and this **sveltekit example uses `@sveltejs/adapter-node`**
- The example at https://sveltekit-web3.herokuapp.com/ has a 1 day lock. To setup your own lock please head over to https://unlock-protocol.com/.
- This example uses `user_data/user_collection` on `getData()` in `index.svelte` file modify this and the claims to fit your need.


## Adding Custom Claims to firestore rules

A slightly modified version of claims from [novum-insights/unlock-protocol-firebase](https://github.com/novum-insights/unlock-protocol-firebase#using-claims-for-role-based-access)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function hasBasicSubsViaMetaMask() {
      return request.auth != null && request.auth.token.metamask_user == true && request.auth.token.metamask_paid == true;
    }

	  function hasBasicSubs() {
      return  hasBasicSubsViaMetaMask();
    }
		match /user_data/user_collection {
    	allow read: if hasBasicSubs();

  	}
  }
}
```


## Current limitations

- Login with google is implemented as an example and our product integration uses social login with stripe/rapyd.
