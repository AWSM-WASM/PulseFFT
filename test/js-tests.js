"use strict"

const chai = require("chai")
const sinonChai = require("sinon-chai")
const sinon = require("sinon")
chai.use(sinonChai)
const expect = chai.expect

const {convert} = require("../pulse/index.js")

// For mocking
const fakeModule = {
    ccall: x => {},
    cwrap: () => fakeModule.cwrapReturnFunction,
    cwrapReturnFunction: () => {}
}

describe("convert", () => {
    describe("constructor", () => {
        it("Throws an error if no module is given", () => {
            const wrapperFn = () => new convert.loadWASM()
            expect(wrapperFn).to.throw("Cannot read property \'loadWASM\' of undefined")
        })
        it("Assigns the given module to the Main instance", () => {
            const main = new convert.loadWASM(fakeModule)
            expect(main.module).to.deep.equal(fakeModule)
        })
    })
})