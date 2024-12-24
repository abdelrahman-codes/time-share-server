function bindMethods(instance) {
  console.log('instance before binding:', instance);
  const proto = Object.getPrototypeOf(instance);
  console.log('proto', proto);
  const propertyNames = Object.getOwnPropertyNames(proto);
  propertyNames.forEach((name) => {
    console.log(name);
    const property = instance[name];
    if (typeof property === 'function') {
      console.log(`Binding method: ${name}`);
      instance[name] = property.bind(instance);
    }
  });
  console.log('instance after binding:', instance);
}
module.exports = bindMethods;
