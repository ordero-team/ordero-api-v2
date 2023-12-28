import * as Validate from 'validatorjs';
import { ErrorMessages, Rules } from 'validatorjs';

export class Validator {
  public static init(data: any, rules: Rules, customMessages?: ErrorMessages): Validate.Validator<any> {
    Validate.register(
      'uid',
      // tslint:disable-next-line:only-arrow-functions
      function (value) {
        // return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
        value = Array.isArray(value) ? value : [value];
        return value.every((item) => item && item.length === 26);
      },
      'The :attribute must be a valid ID.'
    );

    Validate.register(
      'phone',
      // tslint:disable-next-line:only-arrow-functions
      function (value) {
        return /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/g.test(value.replace(/[^0-9+]/g, ''));
      },
      'The :attribute must be valid phone number format.'
    );

    Validate.register(
      'boolean',
      // tslint:disable-next-line:only-arrow-functions
      function (value) {
        return [true, false, 'true', 'false', 0, 1, '0', '1'].includes(value);
      },
      'The :attribute must be valid boolean format.'
    );

    Validate.register(
      'unique',
      // tslint:disable-next-line:only-arrow-functions
      function (value) {
        value = Array.isArray(value) ? value : [value];
        const unique = value.filter((item, i, ar) => ar.indexOf(item) === i);
        return unique.length === value.length;
      },
      'The :attribute values must be unique.'
    );

    Validate.register(
      'safe_text',
      // tslint:disable-next-line:only-arrow-functions
      function (value) {
        value = Array.isArray(value) ? value : [value];
        return value.every((item) => /^[a-zA-Z0-9_\- ]+$/.test(item));
      },
      'The :attribute field may only contain alpha-numeric characters, dashes, underscores, and spaces.'
    );

    Validate.register(
      'sku',
      // tslint:disable-next-line:only-arrow-functions
      function (value) {
        value = Array.isArray(value) ? value : [value];
        return value.every((item) => /^[a-zA-Z0-9_\-]+$/.test(item));
      },
      'The :attribute field may only contain alpha-numeric characters, dashes, and underscores.'
    );

    Validate.register(
      'latlon',
      // tslint:disable-next-line:only-arrow-functions
      function (value) {
        return /^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/g.test(value);
      },
      'The :attribute must be valid latitude longitude format (lat,lon).'
    );

    // tslint:disable-next-line:only-arrow-functions
    Validate.setAttributeFormatter(function (attribute) {
      return attribute.replace(/_/g, ' ').replace(/\./g, ' ');
    });

    return new Validate(data, rules, customMessages);
  }
}
