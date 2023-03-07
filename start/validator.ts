import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('sexo', (value, _, { pointer, errorReporter }) => {
  if (value !== 'M' && value !== 'F') {
    errorReporter.report(pointer, 'sexo', 'El valor del campo debe ser M o F')
  }
})

declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
      sexo(): Rule
    }
  }
  
