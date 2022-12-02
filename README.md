# Firebase helpers

> INFO: Firebase helpers is currently in BETA status and should probably not be used for production as some APIs and functions might change in the future.

## Introduction
When working with Firebase and TypeScript creating Classes for Firestore Documents can be a bit annoying.
As there is not standard way of parsing and writing your Class to a Firestore Document, every project
uses an different way.

The Firebase helpers will change that by providing a standard way of using Classes that can then be stored into
the Firestore Database. It makes creating, reading and maintaining Firestore Document Classes easy and consistent across projects.

## Installation

### Installation for Admin SDK (Functions, backend etc.)
`npm install @janwuesten/firebase-admin-helpers`

### Installation for Web SDK (requires Web version 9)
`npm install @janwuesten/firebase-helpers`

## Basic usage example
### firebase-admin-helpers
```ts
import * as admin from "firebase-admin"
import { DocumentClass, DocumentClassDefineProps, DocumentMap, DocumentMapDefineProps } from "@janwuesten/firebase-admin-helpers"

export class Account extends DocumentClass {
    username: string = ""
    firstName: string | null = null
    lastname: string | null = null

    definition({ define, defineCollection }: DocumentClassDefineProps): void {
        // Define a prop
        define("username", "string")
        define("firstName", "string")
        define("lastName", "string")

        // Define what collection will be used
        defineCollection(() => admin.firestore().collection("account"))
    }
}
```

### firebase-helpers
```ts
// firestore is the output of getFirestore()
import { firestore } from "@/firestore"

import { collection } from "firebase/firestore"
import { DocumentClass, DocumentClassDefineProps, DocumentMap, DocumentMapDefineProps } from "@janwuesten/firebase-helpers"

export class Account extends DocumentClass {
    username: string = ""
    firstName: string | null = null
    lastname: string | null = null

    definition({ define, defineCollection }: DocumentClassDefineProps): void {
        // Define a prop
        define("username", "string")
        define("firstName", "string")
        define("lastName", "string")

        // Define what collection will be used
        defineCollection(() => collection(firestore, "account"))
    }
}
```

### Setting or creating a document
```ts
const account = new Account()
account.username = "MyUsername"
await account.set()
// Created document ID:
console.log(account.id)
```

### Getting a document
```ts
const account = new Account("document id")
if (await account.get()) {
    console.log("Account does exist")
} else {
    console.log("Account does not exist")
}
```

### Updating a document
```ts
const account = new Account("document id")
await account.get()
account.username = "MyNewUsername"
await account.update()
// You can also use:
// await account.set()
```


### Deleting a document
```ts
const account = new Account("document id")
await account.delete()
```

> For more information on how to use the Firebase helper visit the GitHub Wiki page