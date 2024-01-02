[![Publish npm package](https://github.com/janwuesten/firebase-typescript/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/janwuesten/firebase-typescript/actions/workflows/npm-publish.yml)
[![Test npm package](https://github.com/janwuesten/firebase-typescript/actions/workflows/npm-test.yml/badge.svg)](https://github.com/janwuesten/firebase-typescript/actions/workflows/npm-test.yml)

# Firebase for TypeScript

## Introduction
When working with Firebase and TypeScript creating Classes for Firestore Documents can be a bit annoying.
As there is not standard way of parsing and writing your Class to a Firestore Document, every project
uses an different way.

The Firebase for TypeScript will change that by providing a standard way of using Classes that can then be stored into
the Firestore Database. It makes creating, reading and maintaining Firestore Document Classes easy and consistent across projects.

## Installation

### Installation
This installation method support firebase for web, firebase admin and firebase for react native by default.

`npm install @janwuesten/firebase-typescript`

Keep in mind that you still need to install the firebase sdk for that environment.
[You can see more information in the Wiki](https://janwuesten.github.io/firebase-typescript/docs/getting-started/installation).

## Basic usage example
```ts
import { getFirestore, collection } from "firebase/firestore"
import { DocumentClass, DocumentClassDefineProps } from "@janwuesten/firebase-typescript"

export class Account extends DocumentClass {
    username: string = ""
    firstName: string | null = null
    lastname: string | null = null

    definition({ define, defineCollection, defineHandler }: DocumentClassDefineProps) {
        // Define a prop
        define("username", "string")
        define("firstName", "string")
        define("lastName", "string")

        // Define what collection will be used
        defineCollection(() => collection(getFirestore(), "account"))

        // Define the document class handler to set which firebase app is used
        // and if this class if for web, admin or react native
        // you can see example handlers for web, admin and react native in the wiki:
        // https://janwuesten.github.io/firebase-typescript/docs/getting-started/handlers
        defineHandler(new MyClassHandler())
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

For more information on how to use firebase-typescript with all its features visit the [documentation](https://janwuesten.github.io/firebase-typescript/docs/intro).
