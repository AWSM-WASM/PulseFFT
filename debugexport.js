
"use strict"
let testing = () => { console.log("testing yay!") }
let testPromise = testing();
let test = await testPromise;


// async function test() {
//     try {
//         let result = await testing();
//         return result;
//     } catch (err) {
//         console.log("error", err)
//     }
// }

// export default test
module.exports = test;


