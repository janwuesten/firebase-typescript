import { test } from "@jest/globals"
import { DocumentClass, DocumentClassDefineProps } from "../src"

class City extends DocumentClass {
  name!: string

  constructor(name: string) {
    super()
    this.name = name
  }

  definition({ define }: DocumentClassDefineProps): void {
    define<string, string>("name", (data) => this.name = data ?? "", () => this.name)
  }
}
class Country extends DocumentClass {
  name!: string
  code!: string
  cities!: City[]

  definition({ define }: DocumentClassDefineProps): void {
    define<string, string>("name", (data) => this.name = data ?? "", () => this.name)
    define<string, string>("code", (data) => this.code == data ?? "", () => this.code)
    define<any, City[]>("cities", (data) => this.cities = data ?? [], () => this.cities)
  }
}

const executions = 1000

test("DocumentClass toData()", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new Country()
    country.code = "DK"
    country.name = "Denmark"
    await country.toData()
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[DocumentClass toData()]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("DocumentClass fromData()", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new Country()
    await country.fromData({
      name: "Denmark",
      code: "DK",
      cities: [
        { name: "Kopenhagen" },
        { name: "Aalborg" }
      ]
    })
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[DocumentClass fromData()]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("DocumentClass async toData()", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  const promises: Promise<any>[] = []
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new Country()
    country.code = "DK"
    country.name = "Denmark"
    promises.push(country.toData())
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  await Promise.all(promises)
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[DocumentClass async toData()]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("DocumentClass async fromData()", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  const promises: Promise<any>[] = []
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new Country()
    promises.push(country.fromData({
      name: "Denmark",
      code: "DK",
      cities: [
        { name: "Kopenhagen" },
        { name: "Aalborg" }
      ]
    }))
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  await Promise.all(promises)
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[DocumentClass async fromData()]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("native", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const createCountry = () => {
      return {
        code: "DK",
        name: "Denmark",
        cities: [
          { name: "Kopenhagen" },
          { name: "Aalborg" }
        ]
      }
    }
    createCountry()
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[native]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})