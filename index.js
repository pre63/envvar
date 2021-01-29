'use strict'

function ValueError(message) {
  this.message = message
}
ValueError.prototype = Object.create(Error.prototype)
ValueError.prototype.name = 'ValueError'

function UnsetVariableError(message) {
  this.message = message
}

UnsetVariableError.prototype = Object.create(Error.prototype)
UnsetVariableError.prototype.name = 'UnsetVariableError'

function spazio(source, source2) {
  function getEnv() {
    return !!source || !!source2 ? Object.assign({}, source, source2) : process.env
  }

  var createUnsetVariableError = function(name) {
    return new UnsetVariableError('No environment variable named "' + name + '"')
  }

  var checkDefaultValueType = function(name, typeName, value) {
    if (Object.prototype.toString.call(value) !== '[object ' + typeName + ']') {
      throw new TypeError('Default value of (source)["' + name + '"] is not of type ' + typeName)
    }
  }

  var def = function(typeName, coerce) {
    return function(name, value) {
      var n = arguments.length
      if (n < 1) throw new Error('Too few arguments')
      if (n > 2) throw new Error('Too many arguments')

      if (n === 2) checkDefaultValueType(name, typeName, value)

      if (!Object.prototype.hasOwnProperty.call(getEnv(), name)) {
        if (n === 2) return value
        throw createUnsetVariableError(name)
      }

      return coerce(name, getEnv()[name])
    }
  }
  return {
    boolean: def('Boolean', function(name, value) {
      if (value === 'true') return true
      if (value === 'false') return false
      throw new ValueError('Value of (source)["' + name + '"] is neither "true" nor "false"')
    }),
    number: def('Number', function(name, value) {
      var num = Number(value)
      if (num === num) return num
      throw new ValueError('Value of (source)["' + name + '"] does not represent a number')
    }),

    string: def('String', function(name, value) {
      return value
    }),

    oneOf: function(name, members, value) {
      var n = arguments.length
      if (n < 2) throw new Error('Too few arguments')
      if (n > 3) throw new Error('Too many arguments')

      members.forEach(function(member) {
        if (Object.prototype.toString.call(member) !== '[object String]') {
          throw new TypeError('Enumerated types must consist solely of string values')
        }
      })

      if (n === 3) checkDefaultValueType(name, 'String', value)

      if (!Object.prototype.hasOwnProperty.call(getEnv(), name)) {
        if (n === 3) return value
        throw createUnsetVariableError(name)
      }

      if (members.indexOf(getEnv()[name]) < 0) {
        throw new ValueError(
          'Value of (source)["' + name + '"] ' + 'is not a member of (' + members.join(' | ') + ')'
        )
      }

      return getEnv()[name]
    }
  }
}

exports = spazio
exports.UnsetVariableError = UnsetVariableError
exports.ValueError = ValueError
exports.spazio = spazio
module.exports = exports
