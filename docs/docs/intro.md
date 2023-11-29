---
sidebar_position: 1
---

# Introduction

## What is Firebase TypeScript?

When working with Firebase and TypeScript creating Classes for Firestore Documents can be a bit annoying. As there is not standard way of parsing and writing your Class to a Firestore Document, every project uses an different way.

Firebase TypeScript will change that by providing a standard way of creating and using Classes that can then be stored into the Firestore Database. It makes creating, reading and maintaining Firestore Document Classes easy and consistent across projects.

On top of that Firebase TypeScript extends the workflow with features like events, extended batch writes and support for common patterns to share code between your Web, Server and React Native applications.

### Example

This is a short example of the usage for Firebase TypeScript.

```ts
export class City extends DocumentClass {
    name!: string
    country!: string
    capital!: boolean
    population!: number

    definition({ define, defineCollection, defineHandler }: DocumentClassDefineProps) {
        define("name", "string").defaultValue("")
        define("country", "string").defaultValue("")
        define("capital", "boolean").defaultValue(false)
        define("population", "number").defaultValue(0)

        defineCollection(() => collection(getFirestore(), "city"))
        defineHandler(new MyClassHandler())
    }
}

const stockholm = new City()
stockholm.name = "Stockholm"
stockholm.country = "SWE"
stockholm.capital = true
stockholm.population = 10420000
await stockholm.add()
console.log(`New document ID: ${stockholm.id}`)

const berlin = new City("berlin-document-id")
if (await berlin.get()) {
  berlin.population = 3645000
  await berlin.update()
  // or: await berlin.set()
} else {
  console.log("Berlin does not exist")
}

const cityToRemove = new City("city-to-remove-id")
if (await cityToRemove.get()) {
  await cityToRemove.delete()
}
```

## Important information

The Firebase TypeScript package is not officially created, maintained or in any other relationship by Google. It uses the original library made by Google and only provides a class pattern on top of it.

## Supported use cases

Firebase TypeScript is supported for the following use cases:
- Firebase Web SDK
- Firebase Admin SDK
- Firebase for React Native via [React Native Firebase](https://rnfirebase.io/)

For all use cases the NPM package stays the same - so sharing code between projects is fully possible and supported. This means that you can create "common classes" with attributes than can then be shared between your backend, your websites and your native apps.