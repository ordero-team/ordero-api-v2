import { GenericException } from '@lib/exceptions/generic.exception';
import { ResourceAbstract } from '@lib/transformer/resources/abstract.resource';
import { Collection } from '@lib/transformer/resources/collection.resource';
import { Item } from '@lib/transformer/resources/item.resource';
import { Null } from '@lib/transformer/resources/null.resource';
import { startCase } from 'lodash';

export class TransformerAbstract {
  get availableInclude() {
    return [];
  }

  get defaultInclude() {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(entity?: any) {
    throw new GenericException(
      'You have to implement the method transform or specify a variant when calling the transformer!'
    );
  }

  collection(data, transformer) {
    return new Collection(data, transformer);
  }

  item(data, transformer) {
    return new Item(data, transformer);
  }

  null() {
    return new Null();
  }

  async _processIncludedResources(parentScope, data) {
    const includeData = {};

    // figure out which of the available includes are requested
    const resourcesToInclude = this._figureOutWhichIncludes(parentScope);

    // load related lucid models
    await this._eagerloadIncludedResource(resourcesToInclude, data);

    // for each include call the include function for the transformer
    for (const include of resourcesToInclude) {
      const resource = await this._callIncludeFunction(include, parentScope, data);

      // if the include uses a resource, run the data through the transformer chain
      if (resource instanceof ResourceAbstract) {
        includeData[include] = await this._createChildScopeFor(parentScope, resource, include).toJSON();
      } else {
        // otherwise, return the data as is
        includeData[include] = resource;
      }
    }

    return includeData;
  }

  async _callIncludeFunction(include, parentScope, data) {
    const funcName = startCase(include.toLowerCase()).replace(' ', '');
    const includeName = `include${funcName}`;

    if (!(this[includeName] instanceof Function)) {
      throw new GenericException(`A method called '${includeName}' could not be found in '${this.constructor.name}'`);
    }

    return this[includeName](data, parentScope._ctx);
  }

  _figureOutWhichIncludes(parentScope) {
    const includes = this.defaultInclude;

    const requestedAvailableIncludes = this.availableInclude.filter((i) => parentScope._isRequested(i));

    return includes.concat(requestedAvailableIncludes);
  }

  _createChildScopeFor(parentScope, resource, include) {
    // create a new scope
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Scope = require('./scope.transformer').Scope;
    const childScope = new Scope(parentScope._manager, resource, parentScope._ctx, include);

    // get the scope for this transformer
    const scopeArray = [...parentScope.getParentScopes()];

    if (parentScope.getScopeIdentifier()) {
      scopeArray.push(parentScope.getScopeIdentifier());
    }

    // set the parent scope for the new child scope
    childScope.setParentScopes(scopeArray);

    return childScope;
  }

  // TODO: Need to review
  async _eagerloadIncludedResource(resourcesToInclude, data) {
    // if there is no loadMany function, return since it probably is not a lucid model
    if (!data.loadMany) {
      return;
    }

    // figure out which resources should be loaded
    const resourcesToLoad = resourcesToInclude.filter((resource) => {
      // check that a relation method exists and that the relation was not previously loaded.
      return data[resource] instanceof Function && !data.getRelated(resource) && data.$relations[resource] !== null;
    });

    // if no resources should be loaded, return
    if (!resourcesToLoad.length) {
      return;
    }

    // load all resources
    await data.loadMany(resourcesToLoad);
  }
}
