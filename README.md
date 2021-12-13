# Unlock-protocol + Sveltekit

Elevate your SaaS product to login with MetaMask, Firebase, and paywall customers with [unlock-protocol](https://unlock-protocol.com/).

At Novum we use Unlock to add membership our [momentum pairs](https://novuminsights.com/momentum-pairs-for-your-defi-gains/).
## Features

- Use Metamask to log in via Firebase.
- Uses both firebase-admin and firebase v9.
- Firebase [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) for access to database.
- Dockerized application.

## Setup

Clone repo, `npm i` | `pnpm i`.

1. Add the `serviceaccount.json` obtained from firebase console -> Project settings -> Service accounts -> Generate new private and, encode to base64 using any of these commands.

    - `openssl base64 < serviceaccount.json -A | xclip -sel clipboard` paste contents of this file to `.env` (on mac use pbcopy instead of xclip).
    - `openssl base64 -in serviceaccount.json -out encoded_serviceaccount.txt -A` - copy contents of this file to `.env` and **do not** commit the `txt` file.

2. Replace contents of `contract.abi.json` that you can get from your deployed contract. Example ([etherscan](https://rinkeby.etherscan.io/address/0x3f496D438aE2520ee839f3909ECeCcA40B4B22D3#code) of this sample application)

3. Add `firebaseConfig` from firebase console -> Project settings -> General (scroll down to your apps) to `src/lib/constants.ts`

4. Add a JSON-RPC API provider from [infura.io](https://infura.io/) or [alchemyapi.io](https://www.alchemy.com/) to `.env`.

## Usage

`pnpm dev` and be sure to use MetaMask with RINKEBY as your network. Once you pay for the Unlock key will you be able to fetch the data from Firebase. Otherwise, you will get 403 Permission errors.

- The sample app requests the client to switch to the rinkeby network.

## Sanity Checks and prerequisites.

- Have Cloud Firestore enabled on Firebase.
- Have anonymous/Google provider login enabled on authentication on Firebase.
- The `firebase-admin` package isn't friendly with serverless environments and this **sveltekit example uses `@sveltejs/adapter-node`**
- The example at https://sveltekit-web3.herokuapp.com/ has a 1-day lock. To set up your lock please head over to https://unlock-protocol.com/.
- This example uses `user_data/user_collection` on `getData()` in `index.svelte` Modify this and the claims to fit your need.


## Adding Custom Claims to Firestore rules

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
