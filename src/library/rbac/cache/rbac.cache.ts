import { ICacheRBAC } from '@lib/rbac';
import { Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class RbacCache implements ICacheRBAC {
  KEY = 'RBAC';
  TTL = 0;

  private readonly cache;

  constructor() {
    this.cache = new NodeCache();
  }

  get(): any {
    return this.cache.get(this.KEY);
  }

  set(value: any): void {
    this.cache.set(this.KEY, value, this.TTL);
  }

  del(): void {
    this.cache.del(this.KEY);
  }
}
