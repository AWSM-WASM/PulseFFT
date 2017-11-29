import xxhash from "xxhash-wasm";

xxhash().then(hasher => {
    const input = "The string that is being hashed";
    hasher.h32(input);
})