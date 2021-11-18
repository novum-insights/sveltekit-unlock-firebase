# Unlock-protocol + Sveltekit

## Setup

Clone repo, `npm i` | `pnpm i`.

Add `serviceaccount.json` obtained from firebase console -> Project settings -> Service accounts -> Generate new private `src/routes`.

Add `contract.abi.json` that you can get from [etherscan](https://rinkeby.etherscan.io/address/0x7b3f121baba6ffe673875a92eb0f3f05f20bed24#code).

Add `firebaseConfig` from firebase console -> Project settings -> General (scroll down to your apps) to `src/lib/constants.ts`

Add a JSON-RPC API provider from infura.io or alchemyapi.io to `.env` check `.env-sample`.

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

Features

- Use Metamask to login via firebase
- Uses both firebase-admin and firebase v9
- Firebase [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) for access to database

## Usage

`pnpm dev` use metamask with `RINKEBY` as your network once you pay the key for unlock you will be able to fetch the data from firebase or you will get 403 Permission errors.
