import { expect, test } from "@jest/globals"
import { credential } from "firebase-admin"
import { initializeApp } from "firebase-admin/app"
import { getFirestore, GeoPoint} from "firebase-admin/firestore"
import { DocumentBatch, DocumentClass, DocumentClassDefineProps, DocumentFactory, DocumentMap, DocumentMapDefineProps, Mappable } from "../src"

initializeApp({
    credential: credential.cert("../serviceAccountKey.json")
})

class TypeTestMap extends DocumentMap {
    string: string = ""

    definition({ define }: DocumentMapDefineProps): void {
        define("string", "string")
    }
}
class TypeTest extends DocumentClass {
    string: string = "default value test"
    number: number = 0
    boolean: boolean = false
    geopoint: GeoPoint = new GeoPoint(0, 0)
    stringArray: string[] = []
    map: TypeTestMap = new TypeTestMap()
    mapArray: TypeTestMap[] = []
    mappable: Mappable<TypeTestMap> = new Mappable()
    timestamp: Date = new Date()

    definition({ define, defineCollection }: DocumentClassDefineProps): void {
        define("string", "string").defaultValue(() => this.string)
        define("number", "number").defaultValue(10)
        define("boolean", "boolean")
        define("geopoint", "geopoint")
        define("stringArray", "array")
        define("map", "map").defineMap(() => new TypeTestMap())
        define("mapArray", "mapArray").defineMap(() => new TypeTestMap())
        define("mappable", "mappable").defineMap(() => new TypeTestMap())
        define("timestamp", "timestamp")

        defineCollection(() => getFirestore().collection("typetest"))
    }
}
const timestamp = new Date()
let typeTestID = ""
test("setting types", async () => {
    const typeTest = new TypeTest()
    typeTest.string = "TEST STRING"
    typeTest.number = 10
    typeTest.boolean = true
    typeTest.geopoint = new GeoPoint(10, 10)
    typeTest.stringArray = [
        "Test 1",
        "Test 2",
        "Test 3"
    ]
    const ttm1 = new TypeTestMap()
    ttm1.string = "TTM1"
    typeTest.map = ttm1

    const ttm2 = new TypeTestMap()
    ttm2.string = "TTM2"
    const ttm3 = new TypeTestMap()
    ttm3.string = "TTM3"
    typeTest.mapArray = [
        ttm1,
        ttm2
    ]
    typeTest.mapArray.push(ttm3)

    typeTest.mappable.set("ttm1", ttm1)
    typeTest.mappable.set("ttm2", ttm2)
    typeTest.mappable.set("ttm3", ttm3)

    typeTest.timestamp = timestamp

    await typeTest.add()
    typeTestID = typeTest.id
    expect(typeTestID).toBeTruthy()
})
test("getting types", async () => {
    const typeTest = new TypeTest(typeTestID)
    expect(await typeTest.get()).toBe(true)
    expect(typeTest.string).toBe("TEST STRING")
    expect(typeTest.number).toBe(10)
    expect(typeTest.boolean).toBe(true)
    expect(typeTest.geopoint.latitude).toBe(new GeoPoint(10, 10).latitude)
    expect(typeTest.geopoint.longitude).toBe(new GeoPoint(10, 10).longitude)
    expect(typeTest.stringArray.length).toBe(3)
    expect(typeTest.stringArray[0]).toBe("Test 1")
    expect(typeTest.stringArray[1]).toBe("Test 2")
    expect(typeTest.stringArray[2]).toBe("Test 3")
    expect(typeTest.map).toBeTruthy()
    expect(typeTest.map.string).toBe("TTM1")
    expect(typeTest.mapArray.length).toBe(3)
    expect(typeTest.mapArray[0].string).toBe("TTM1")
    expect(typeTest.mapArray[1].string).toBe("TTM2")
    expect(typeTest.mapArray[2].string).toBe("TTM3")
    expect(typeTest.mappable.size).toBe(3)
    expect(typeTest.mappable.get("ttm1")).toBeTruthy()
    expect(typeTest.mappable.get("ttm2")).toBeTruthy()
    expect(typeTest.mappable.get("ttm3")).toBeTruthy()
    expect(typeTest.mappable.get("ttm1")!.string).toBe("TTM1")
    expect(typeTest.mappable.get("ttm2")!.string).toBe("TTM2")
    expect(typeTest.mappable.get("ttm3")!.string).toBe("TTM3")
    expect(typeTest.timestamp.getTime()).toBe(timestamp.getTime())
})
test("mappable", async () => {
    const mappable = new Mappable()
    mappable.set("test1", "test value 1")
    mappable.set("test2", "test value 2")
    const keysArray = mappable.keysAsArray()
    expect(keysArray.length).toBe(2)
    expect(keysArray[0]).toBe("test1")
    expect(keysArray[1]).toBe("test2")
    const valuesArray = mappable.asArray()
    expect(valuesArray.length).toBe(2)
    expect(valuesArray[0]).toBe("test value 1")
    expect(valuesArray[1]).toBe("test value 2")
})
test("default values", async () => {
    const typeTest = new TypeTest("wrong id")
    expect(typeTest.number).toBe(0)
    expect(typeTest.string).toBe("default value test")
    await typeTest.fromData({})
    expect(typeTest.string).toBe("default value test")
    expect(typeTest.number).toBe(10)
    typeTest.string = "test"
    await typeTest.fromData({})
    expect(typeTest.string).toBe("test")
})
test("clean", async () => {
    const typeTests = await new DocumentFactory(() => new TypeTest).getDocs(getFirestore().collection("typetest"))
    const batch = new DocumentBatch()
    for (const typeTest of typeTests) {
        await batch.delete(typeTest)
    }
    await batch.commit()
})