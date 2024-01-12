import { IFilterPermission } from '@lib/rbac';

export interface IStorageRbac {
  roles: string[];
  permissions: any;
  grants: any;
  filters: { [key: string]: any | IFilterPermission };
}
