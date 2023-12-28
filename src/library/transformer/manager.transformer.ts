import { Scope } from '@lib/transformer/scope.transformer';
import Serializers from '@lib/transformer/serializers';

export class Manager {
  public serializer: any;
  public requestedIncludes: any;
  public _recursionLimit: any;

  constructor() {
    this.serializer = null;
    this.requestedIncludes = new Set();
    this._recursionLimit = 3;
  }

  createData(resource, ctx = null) {
    this._setIncludesFromRequest(ctx);
    return new Scope(this, resource, ctx);
  }

  getRequestedIncludes() {
    return this.requestedIncludes;
  }

  parseIncludes(includes) {
    this.requestedIncludes = new Set();

    // if a string is passed, split by comma and return an array
    if (typeof includes === 'string') {
      includes = includes.split(',');
    }

    // if it is not an array, we can not parse it at this point
    if (!Array.isArray(includes)) {
      throw Error(`The parseIncludes() method expects a string or an array. ${typeof includes} given`);
    }

    // sanitize the includes
    includes = includes.map((i) => this._guardAgainstToDeepRecursion(i)).map((i) => this._formatIncludeName(i));

    // add all includes to the internal set
    includes.forEach(this.requestedIncludes.add, this.requestedIncludes);
    this._autoIncludeParents();
  }

  setRecursionLimit(limit) {
    this._recursionLimit = limit;

    return this;
  }

  setSerializer(serializer) {
    if (typeof serializer === 'string') {
      serializer = new Serializers[serializer]();
    }

    this.serializer = serializer;
  }

  getSerializer() {
    if (!this.serializer) {
      this.setSerializer('plain');
    }

    return this.serializer;
  }

  _formatIncludeName(include) {
    // split the include name by recursion level
    return include
      .split('.')
      .map((fragment) => {
        // Split on underscores and hyphens to properly support multi-part includes
        // const fragments = fragment.split(/[_|-]/);

        // transform the fist letter of each word into uppercase, except for the first word.
        // const camelCaseInclude = fragments.slice(1).map((word) => word[0].toUpperCase() + word.substr(1));

        // combine the first word with the rest of the fragments
        // return fragments
        //   .slice(0, 1)
        //   .concat(camelCaseInclude)
        //   .join('');

        return fragment;
      })
      .join('.');
  }

  _guardAgainstToDeepRecursion(include) {
    return include.split('.').slice(0, this._recursionLimit).join('.');
  }

  _autoIncludeParents() {
    const parsed = [];

    // for each resource that is requested
    for (const include of this.requestedIncludes) {
      // we split it by '.' to get the recursions
      const nested = include.split('.');

      // Add the first level to the includes
      let part = nested.shift();
      parsed.push(part);

      // if there are more nesting levels,
      // add each level to the includes
      while (nested.length) {
        part += `.${nested.shift()}`;
        parsed.push(part);
      }
    }

    // add all parsed includes to the set of requested includes
    parsed.forEach(this.requestedIncludes.add, this.requestedIncludes);
  }

  _setIncludesFromRequest(ctx) {
    // get all get parameters from the request
    const params = JSON.parse(JSON.stringify((ctx && ctx.request.query) || {}));

    // if the 'include' parameter is set, pass it the the parse method
    if (params.include) {
      this.parseIncludes(params.include);
    }
  }
}
