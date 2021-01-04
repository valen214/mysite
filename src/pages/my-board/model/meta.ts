

export function applyMixins(derivedConstructor: any, constructors: any[]){
  constructors.forEach(baseConstructor => {
    Object.getOwnPropertyNames(baseConstructor.prototype).forEach(name => {
      Object.defineProperty(
        derivedConstructor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseConstructor.prototype, name)
      );
    })
  })

  console.log(derivedConstructor);

  return derivedConstructor
}