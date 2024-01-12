import { DynamicModule, Module } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { ICacheRBAC } from './interfaces/cache.rbac.interface';
import { IDynamicStorageRbac } from './interfaces/dynamic.storage.rbac.interface';
import { IStorageRbac } from './interfaces/storage.rbac.interface';
import { RbacService } from './services/rbac.service';
import { StorageRbacService } from './services/storage.rbac.service';

@Module({
  providers: [RbacService, StorageRbacService, Reflector],
  imports: [],
  exports: [RbacService],
})
export class RBAcModule {
  private static cache?: any | ICacheRBAC;
  private static cacheOptions?: { KEY?: string; TTL?: number };

  static useCache(
    cache: any | ICacheRBAC,
    options?: {
      KEY?: string;
      TTL?: number;
    }
  ) {
    RBAcModule.cache = cache;
    RBAcModule.cacheOptions = options;
    return RBAcModule;
  }

  static forRoot(rbac: IStorageRbac, providers?: any[], imports?: any[]): DynamicModule {
    return RBAcModule.register(
      /* tslint:disable */
      class {
        async getRbac(): Promise<IStorageRbac> {
          return rbac;
        }
      },
      providers,
      imports
    );
  }

  static register(rbac: new () => IDynamicStorageRbac, providers?: any[], imports?: any[]): DynamicModule {
    const inject = [ModuleRef, rbac];
    const commonProviders = [];
    if (RBAcModule.cache) {
      commonProviders.push(RBAcModule.cache, {
        provide: 'ICacheRBAC',
        useFactory: (cache: ICacheRBAC): ICacheRBAC => {
          return RBAcModule.setCacheOptions(cache);
        },
        inject: [RBAcModule.cache],
      });
      inject.push(RBAcModule.cache);
    }

    commonProviders.push(
      ...[
        ...(providers || []),
        rbac,
        {
          provide: StorageRbacService,
          useFactory: async (moduleRef: ModuleRef, rbacService: IDynamicStorageRbac, cache?: ICacheRBAC) => {
            return new StorageRbacService(moduleRef, rbacService, RBAcModule.setCacheOptions(cache));
          },
          inject,
        },
      ]
    );

    return {
      module: RBAcModule,
      providers: commonProviders,
      imports: [...(imports || [])],
    };
  }

  private static setCacheOptions(cache?: ICacheRBAC) {
    if (!cache || RBAcModule.cacheOptions) {
      return cache;
    }
    if (!RBAcModule.cacheOptions) {
      return cache;
    }
    if (RBAcModule.cacheOptions.KEY) {
      cache.KEY = RBAcModule.cacheOptions.KEY;
    }

    if (RBAcModule.cacheOptions.TTL) {
      cache.TTL = RBAcModule.cacheOptions.TTL;
    }

    return cache;
  }
}
