import { describe, it } from 'mocha';
import assert from 'assert';
import validator from '..';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer' },
    location: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        coordinates: {
          type: 'object',
          properties: {
            lng: { type: 'number' },
            lat: { type: 'number' },
          },
          required: ['lat', 'lng'],
        },
      },
      required: ['address', 'coordinates'],
    },
  },
  required: ['name', 'location'],
};

const validate = validator(schema);

describe('all()', () => {
  it('validates an object based on a schema', () => {
    const errors = validate.all({
      name: 'N',
      age: 13,
      location: {
        address: 'somewhere noice',
        coordinates: {
          lat: 90,
          lng: 90,
        },
      },
    });

    assert.equal(errors, null);
  });

  it('returns errors for an invalid object', () => {
    const errors = validate.all({
      name: 13,
      location: {
        address: 'hi',
        coordinates: {
          lat: 123,
          lng: 'hi',
        },
      },
    });

    assert.equal(errors['location.coordinates.lng'].message, 'is the wrong type');
  });
});

describe('partial()', () => {
  it('validates only the included fields of an object', () => {
    const errors = validate.partial({
      name: 'hi',
      location: {
        coordinates: {
          lat: 13,
        },
      },
    });

    assert.equal(errors, null);
  });

  it('returns errors only for the included fields', () => {
    const errors = validate.partial({
      location: {
        coordinates: {
          lng: '13',
        },
      },
    });

    assert.equal(Object.keys(errors).length, 1);
    assert.equal(errors['location.coordinates.lng'].message, 'is the wrong type');
  });
});
