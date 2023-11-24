import { expect, test } from "@jest/globals"
import { credential } from "firebase-admin"
import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { DocumentBatch, DocumentClass, DocumentClassDefineProps, DocumentFactory } from "../src"
import { DocumentHandler, BatchHandler } from "./handler"

initializeApp({
  credential: credential.cert("serviceAccountKey.json")
})

class Country extends DocumentClass {
  name: string = this.requiredDefault("name")
  code: string = this.requiredDefault("code")

  definition({ define, defineCollection, defineHandler }: DocumentClassDefineProps): void {
    define<typeof this.name>("name", "string")
    define<typeof this.code>("code", "string")

    defineCollection(() => getFirestore().collection("country"))
    defineHandler(new DocumentHandler())
  }
}

let countryID = "";

test("adding documents", async () => {
  const country = new Country()
  country.code = "DK"
  country.name = "Denmark"
  expect(country.id).toBeFalsy()
  await country.add()
  expect(country.id).toBeTruthy()
  countryID = country.id
})
test("getting documents", async () => {
  const country = new Country(countryID)
  expect(await country.get()).toBe(true)
  expect(country.id).toBe(countryID)
  expect(country.name).toBe("Denmark")
  expect(country.code).toBe("DK")
})
test("updating documents", async () => {
  const country = new Country(countryID)
  expect(await country.get()).toBe(true)
  expect(country.id).toBe(countryID)
  expect(country.name).toBe("Denmark")
  expect(country.code).toBe("DK")
  country.name = "Germany"
  country.code = "DE"
  await country.update()
})
test("setting documents", async () => {
  const country = new Country(countryID)
  expect(await country.get()).toBe(true)
  expect(country.id).toBe(countryID)
  expect(country.name).toBe("Germany")
  expect(country.code).toBe("DE")
  country.name = "Denmark"
  country.code = "DK"
  await country.set()
  expect(country.id).toBe(countryID)
})
test("deleting documents", async () => {
  const country = new Country(countryID)
  expect(await country.get()).toBe(true)
  expect(country.id).toBe(countryID)
  expect(country.name).toBe("Denmark")
  expect(country.code).toBe("DK")
  await country.delete()
  expect(await new Country(countryID).get()).toBe(false)
})
test("clean", async () => {
  const countries = await new DocumentFactory(() => new Country).fromQuerySnapshot(await getFirestore().collection("country").get())
  const batch = new DocumentBatch(new BatchHandler())
  for (const country of countries) {
    await batch.delete(country)
  }
  await batch.commit()
})