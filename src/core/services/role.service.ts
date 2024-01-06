import { RequestHelper } from '@lib/helpers/request.helper';
import { IDynamicStorageRbac, IStorageRbac } from '@lib/rbac';
import { Injectable } from '@nestjs/common';
import { uniq } from 'lodash';

export enum PermAct {
  C = 'create',
  R = 'read',
  U = 'update',
  D = 'delete',
}

export enum PermOwner {
  Restaurant = 'restaurant',
  Profile = 'profile',
}

export const DefaultPerms = [PermOwner.Profile, PermOwner.Restaurant];

@Injectable()
export class RoleService implements IDynamicStorageRbac {
  getRbac(): Promise<IStorageRbac> {
    const grants = RequestHelper.getPermissionGrants();
    const combinedGrants = {};
    for (const [role, perms] of Object.entries(grants) as any) {
      combinedGrants[role] = uniq([...perms, ...DefaultPerms]);
    }

    const permissions = {
      [PermOwner.Profile]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Restaurant]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
    };

    return {
      filters: {},
      grants: combinedGrants,
      roles: Object.keys(combinedGrants),
      permissions,
    } as any;
  }
}
