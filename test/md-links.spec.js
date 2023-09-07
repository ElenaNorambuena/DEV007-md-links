const myFunctions = require("./../index.js")

describe ("isMd", ()=>{
it ('debería ser una función', ()=>{
  expect (typeof myFunctions.isMd).toBe('function');
});
});

describe ("isAbsolute", ()=>{
  it ('debería ser una función', ()=>{
    expect (typeof myFunctions.isAbsolute).toBe('function');
  });
});

