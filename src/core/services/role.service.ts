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
  Profile = 'profile',
  Restaurant = 'restaurant',
  Staff = 'staff',
  Role = 'role',
  Location = 'location',
  Table = 'table',
  Category = 'category',
  Variant = 'variant',
  Product = 'product',
  Stock = 'stock',
  Order = 'order',
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
      [PermOwner.Staff]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Role]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Location]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Table]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Category]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Variant]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Product]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Stock]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
      [PermOwner.Order]: [PermAct.R, PermAct.C, PermAct.U, PermAct.D],
    };

    return {
      filters: {},
      grants: combinedGrants,
      roles: Object.keys(combinedGrants),
      permissions,
    } as any;
  }
}
