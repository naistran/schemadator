import validator from 'is-my-json-valid';
import toDot from 'to-dot';

const defaultOptions = {
  greedy: true,
};

// remove uses `data.` prefix or set `name` directly
function normaliseErrors(errors, name = undefined) {
  return errors.map(err => ({
    field: name || err.field.replace(/^data\./, ''),
    message: err.message,
  }));
}

function Validator(schema, opts) {
  const validate = validator(schema, {
    ...defaultOptions,
    ...opts,
  });

  // if `data` is `undefined` then validation passes (not what we want)
  function all(data = null) {
    validate(data);
    const { errors } = validate;
    // return an object instead of array
    return errors ?
      normaliseErrors(errors).reduce((obj, err) => {
        obj[err.field] = err;
        return obj;
      }, {}) : null;
  }

  function partial(data) {
    const errs = all(data) || {};
    const dotData = toDot(data);
    const errors = Object.keys(errs).reduce((obj, key) => {
      if (dotData.hasOwnProperty(key)) {
        obj[key] = errs[key];
      }
      return obj;
    }, {});

    // TODO: filter `errors` to show only updated fields
    return Object.keys(errors).length > 0 ?
      errors : null;
  }

  return {
    all,
    partial,
  };
}

export default Validator;
