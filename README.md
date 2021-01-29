# spazio

This is a fork of [envvar](https://github.com/plaid/envvar). It adds alternate sources for the process.env, making it useful in the browser too.

spazio is a tiny JavaScript package for deriving JavaScript values from
environment variables.


**Defaults to process.env as the source of variables:**
```
const spazio = require('spazio')();
```

**Uses window.env as the source of variables:**
```
const spazio = require('spazio')(window.env);
```

**Combines window.env and process.env as sources of environment variables.**
```
const spazio = require('spazio')(process.env, window.env)
```
If the variable exists in both objects, the second one will be used. In this case `spazio.string("FOO")` will return the value of `window.env.FOO`. 

## API and Examples
```javascript
const spazio = require('spazio')()

const GITHUB_API_TOKEN = spazio.string('GITHUB_API_TOKEN')
const HTTP_MAX_SOCKETS = spazio.number('HTTP_MAX_SOCKETS')
const ENABLE_FEATURE_X = spazio.boolean('ENABLE_FEATURE_X', false)
```

If one argument is provided, the environment variable is __required__. If the
environment variable is not set, an `spazio.UnsetVariableError` is thrown:

    UnsetVariableError: No environment variable named "GITHUB_API_TOKEN"

If two arguments are provided, the environment variable is __optional__. If the
environment variable is not set, the default value is used. The default value must be of type Boolean in the case of `spazio.boolean`, of type Number in the case of `spazio.number`, or of type String in the case of `spazio.string`. If
it is not, a `TypeError` is thrown.

The value of the environment variable must be the string representation of a
value of the appropriate type: for `spazio.boolean` the only valid strings are
`'true'` and `'false'`; for `spazio.number` applying `Number` to the string
must not produce `NaN`. If the environment variable is set but does not have
a suitable value, an `spazio.ValueError` is thrown:

    ValueError: Value of (source)["HTTP_MAX_SOCKETS"] does not represent a number

### `spazio.oneOf`

This is similar to `spazio.string`, but with constraints. There may be a small
number of valid values for a given environment variable. For example:

```javascript
const NODE_ENV = spazio.oneOf('NODE_ENV', ['development', 'staging', 'production']);
```

This states that `(source).NODE_ENV` must be set to `development`,
`staging`, or `production`.

A default value may be provided:

```javascript
const NODE_ENV = spazio.oneOf('NODE_ENV', ['development', 'staging', 'production'], 'production');
```

This states that `(source).NODE_ENV` must either be unset (in which case the
default value is assumed), or set to `development`, `staging`, or `production`.
