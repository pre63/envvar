'use strict'

/* global beforeEach, describe, it */

var assert = require('assert')

var spazio = require('..')

var eq = assert.strictEqual

var errorEq = function(type, message) {
  return function(err) {
    return err.name === type.name && err.message === message
  }
}

var throws = assert.throws

beforeEach(function() {
  delete process.env.FOO
})

describe('spazio.getEnv', function() {
  it('window.env as alternate source', function() {
    var window = { env: { FOO: 123 } }
    process.env.FOO = 321
    eq(spazio(window.env).number('FOO'), 123)
  })

  it('window.env and process.env', function() {
    var window = { env: { FOO: 123 } }
    process.env.FOO = 321
    eq(spazio(window.env, process.env).number('FOO'), 321)
  })

  it('undefined and process.env', function() {
    process.env.FOO = 321
    eq(spazio(undefined, process.env).string('FOO'), '321')
  })

  it('anoymous object and undefined', function() {
    process.env.FOO = 321
    eq(spazio({ FOO: 123 }, undefined).number('FOO'), 123)
  })

  it('process.env and window.env', function() {
    var window = { env: { FOO: '123' } }
    process.env.FOO = 321
    eq(spazio(process.env, window.env).string('FOO'), '123')
  })
})

describe('spazio.UnsetVariableError', function() {
  it('inherits from Error', function() {
    eq(new spazio.UnsetVariableError() instanceof Error, true)
  })

  it('is named "UnsetVariableError"', function() {
    eq(new spazio.UnsetVariableError().name, 'UnsetVariableError')
  })

  it('accepts a message argument', function() {
    eq(new spazio.UnsetVariableError('XXX').message, 'XXX')
  })
})

describe('spazio.ValueError', function() {
  it('inherits from Error', function() {
    eq(new spazio.ValueError() instanceof Error, true)
  })

  it('is named "ValueError"', function() {
    eq(new spazio.ValueError().name, 'ValueError')
  })

  it('accepts a message argument', function() {
    eq(new spazio.ValueError('XXX').message, 'XXX')
  })
})

describe('spazio.boolean', function() {
  it('throws if applied to too few arguments', function() {
    throws(function() {
      spazio().boolean()
    }, errorEq(Error, 'Too few arguments'))
  })

  it('throws if applied to too many arguments', function() {
    throws(function() {
      spazio().boolean(1, 2, 3)
    }, errorEq(Error, 'Too many arguments'))
  })

  it('throws a TypeError if default value is not Boolean', function() {
    throws(function() {
      spazio().boolean('FOO', 'true')
    }, errorEq(TypeError, 'Default value of (source)["FOO"] is not of type Boolean'))
  })

  it('throws a ValueError if value is neither "true" nor "false"', function() {
    process.env.FOO = '1'
    throws(function() {
      spazio().boolean('FOO')
    }, errorEq(spazio.ValueError, 'Value of (source)["FOO"] is neither "true" nor "false"'))
  })

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() {
      spazio().boolean('FOO')
    }, errorEq(spazio.UnsetVariableError, 'No environment variable named "FOO"'))
  })

  it('returns default value if variable is not set', function() {
    eq(spazio().boolean('FOO', true), true)
    eq(spazio().boolean('FOO', false), false)
  })

  it('ignores default value if variable is set', function() {
    process.env.FOO = 'true'
    eq(spazio().boolean('FOO', true), true)
    eq(spazio().boolean('FOO', false), true)

    process.env.FOO = 'false'
    eq(spazio().boolean('FOO', true), false)
    eq(spazio().boolean('FOO', false), false)
  })

  it('coerces value to Boolean', function() {
    process.env.FOO = 'true'
    eq(spazio().boolean('FOO'), true)

    process.env.FOO = 'false'
    eq(spazio().boolean('FOO'), false)
  })
})

describe('spazio.number', function() {
  it('throws if applied to too few arguments', function() {
    throws(function() {
      spazio().number()
    }, errorEq(Error, 'Too few arguments'))
  })

  it('throws if applied to too many arguments', function() {
    throws(function() {
      spazio().number(1, 2, 3)
    }, errorEq(Error, 'Too many arguments'))
  })

  it('throws a TypeError if default value is not a number', function() {
    throws(function() {
      spazio().number('FOO', '42')
    }, errorEq(TypeError, 'Default value of (source)["FOO"] is not of type Number'))
  })

  it('throws a ValueError if value does not represent a number', function() {
    process.env.FOO = '1.2.3'
    throws(function() {
      spazio().number('FOO')
    }, errorEq(spazio.ValueError, 'Value of (source)["FOO"] does not represent a number'))
  })

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() {
      spazio().number('FOO')
    }, errorEq(spazio.UnsetVariableError, 'No environment variable named "FOO"'))
  })

  it('returns default value if variable is not set', function() {
    eq(spazio().number('FOO', 42), 42)
  })

  it('ignores default value if variable is set', function() {
    process.env.FOO = '123.45'
    eq(spazio().number('FOO', 42), 123.45)
  })

  it('coerces value to number', function() {
    process.env.FOO = '42'
    eq(spazio().number('FOO'), 42)
  })
})

describe('spazio.string', function() {
  it('throws if applied to too few arguments', function() {
    throws(function() {
      spazio().string()
    }, errorEq(Error, 'Too few arguments'))
  })

  it('throws if applied to too many arguments', function() {
    throws(function() {
      spazio().string(1, 2, 3)
    }, errorEq(Error, 'Too many arguments'))
  })

  it('throws a TypeError if default value is not a string', function() {
    throws(function() {
      spazio().string('FOO', 42)
    }, errorEq(TypeError, 'Default value of (source)["FOO"] is not of type String'))
  })

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() {
      spazio().string('FOO')
    }, errorEq(spazio.UnsetVariableError, 'No environment variable named "FOO"'))
  })

  it('returns default value if variable is not set', function() {
    eq(spazio().string('FOO', 'quux'), 'quux')
  })

  it('ignores default value if variable is set', function() {
    process.env.FOO = 'baz'
    eq(spazio().string('FOO', 'quux'), 'baz')
  })

  it('returns value', function() {
    process.env.FOO = 'quux'
    eq(spazio().string('FOO'), 'quux')
  })
})

describe('spazio.oneOf', function() {
  it('throws if applied to too few arguments', function() {
    throws(function() {
      spazio().oneOf()
    }, errorEq(Error, 'Too few arguments'))
    throws(function() {
      spazio().oneOf(1)
    }, errorEq(Error, 'Too few arguments'))
  })

  it('throws if applied to too many arguments', function() {
    throws(function() {
      spazio().oneOf(1, 2, 3, 4)
    }, errorEq(Error, 'Too many arguments'))
  })

  it('throws a TypeError if the type contains non-string members', function() {
    throws(function() {
      spazio().oneOf('FOO', ['0', '1', 2])
    }, errorEq(TypeError, 'Enumerated types must consist solely of string values'))
    throws(function() {
      spazio().oneOf('FOO', ['0', '1', 2], '0')
    }, errorEq(TypeError, 'Enumerated types must consist solely of string values'))
  })

  it('throws a TypeError if default value is not a string', function() {
    throws(function() {
      spazio().oneOf('FOO', ['0', '1', '2'], 0)
    }, errorEq(TypeError, 'Default value of (source)["FOO"] is not of type String'))
  })

  it('returns default value if variable is not set', function() {
    eq(spazio().oneOf('FOO', ['0', '1', '2'], '0'), '0')
  })

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() {
      spazio().oneOf('FOO', ['0', '1', '2'])
    }, errorEq(spazio.UnsetVariableError, 'No environment variable named "FOO"'))
  })

  it('throws a ValueError if value is not a member of the type', function() {
    process.env.FOO = 'X'
    throws(function() {
      spazio().oneOf('FOO', ['0', '1', '2'])
    }, errorEq(spazio.ValueError, 'Value of (source)["FOO"] is not a member of (0 | 1 | 2)'))
    throws(function() {
      spazio().oneOf('FOO', ['0', '1', '2'], '0')
    }, errorEq(spazio.ValueError, 'Value of (source)["FOO"] is not a member of (0 | 1 | 2)'))
  })

  it('returns value', function() {
    process.env.FOO = '2'
    eq(spazio().oneOf('FOO', ['0', '1', '2']), '2')
  })
})
