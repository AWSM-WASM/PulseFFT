import pulse from "./src/index.js";
// const pulse = require("./");

async function test() {
    const testing = await pulse();
    console.log(testing);
}

export default test


