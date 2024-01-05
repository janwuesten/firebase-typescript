import { expect, test } from "@jest/globals"
import { credential } from "firebase-admin"
import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { DocumentClass, DocumentClassDefineProps } from "../src"
import { DocumentHandler } from "./handler"

initializeApp({
  credential: credential.cert("serviceAccountKey.json")
})

class Country extends DocumentClass {
  name!: string
  code!: string

  definition({ define, defineCollection, defineHandler }: DocumentClassDefineProps): void {
    define<string, string>("name", (data) => this.name = data ?? "", () => this.name)
    define<string, string>("code", (data) => this.code == data ?? "", () => this.code)

    defineCollection(() => getFirestore().collection("country"))
    defineHandler(new DocumentHandler())
  }
}

test("runTransaction set", async () => {
  await getFirestore().runTransaction(async (transaction) => {
    const country = new Country("DK")
    country.code = "DKE"
    country.name = "Denmark"
    await country.withTransaction(transaction).set()
  })
})
test("runTransaction update", async () => {
  await getFirestore().runTransaction(async (transaction) => {
    const country = new Country("DK")
    expect(await country.withTransaction(transaction).get()).toBeTruthy()
    country.code = "DK"
    await country.withTransaction(transaction).update()
  })
})
test("runTransaction get check", async () => {
  await getFirestore().runTransaction(async (transaction) => {
    const country = new Country("DKE")
    expect(await country.withTransaction(transaction).get()).toBeFalsy()
  })
})
test("runTransaction delete", async () => {
  await getFirestore().runTransaction(async (transaction) => {
    const country = new Country("DK")
    expect(await country.withTransaction(transaction).get()).toBeTruthy()
    country.withTransaction(transaction).delete()
  })
})