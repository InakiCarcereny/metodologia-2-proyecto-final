// Aca estan cada una de las reglas al momento de hacer un commit

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Si hay body, tiene que haber una linea en blanco antes
    'body-leading-blank': [2, 'always'],

    // Largo maximo de cada linea en el body
    'body-max-line-length': [2, 'always', 100],

    // Si hay footer, tiene que haber una linea en blanco antes
    'footer-leading-blank': [2, 'always'],

    // Largo maximo del header completo (type(scope): subject)
    'header-max-length': [2, 'always', 85],

    // Scope (opcional, entre parentesis) en minuscula si se usa
    'scope-case': [2, 'always', 'lower-case'],

    // El subject no puede estar todo en mayusculas
    'subject-case': [2, 'never', ['upper-case']],

    // El subject no puede estar vacio
    'subject-empty': [2, 'never'],

    // El subject no puede terminar en punto
    'subject-full-stop': [2, 'never', '.'],

    // El type siempre en minuscula
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // nueva funcionalidad
        'fix', // correccion de bug
        'docs', // solo documentacion
        'style', // formato, espacios, punto y coma, etc (sin cambio de logica)
        'refactor', // cambio de codigo que no arregla bug ni agrega feature
        'perf', // mejora de performance
        'test', // agregar o corregir tests
        'build', // cambios en build system o dependencias
        'ci', // cambios en CI (github actions, etc)
        'chore', // tareas de mantenimiento varias
        'revert', // revertir un commit anterior
      ],
    ],
  },
};
