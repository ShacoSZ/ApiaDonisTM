import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('different', (value,field, { pointer, errorReporter }) => {
    //EL VALUE SI AGARRA EL VALOR QUE ENVIO EN EL REQUEST parseInt(str, 10)
//EL FIELD LLEGA COMO STRING O DESCONOCIDO ,TENGO QUE PASARLO A NUMBER
 // utilizando el operador as

console.log('value',value)
console.log('field',field)
//field tiene que ser int
 if(value == field)
  {
    errorReporter.report(pointer, 'different', 'El valor del campo debe ser diferente al del campo local')
  }
})

declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    different(field: any): Rule
  }
}
