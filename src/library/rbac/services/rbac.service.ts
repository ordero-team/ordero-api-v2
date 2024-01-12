import { IParamsFilter, IRbac, RbacExceptions, RoleRbac, StorageRbacService } from '@lib/rbac';
import { Injectable } from '@nestjs/common';
import { IRoleRbac } from '../role/interfaces/role.rbac.interface';

@Injectable()
export class RbacService implements IRbac {
  constructor(private readonly storageRbacService: StorageRbacService) {}

  async getRole(role: string, paramsFilter?: IParamsFilter): Promise<IRoleRbac> {
    const storage = await this.storageRbacService.getStorage();
    if (!storage.roles || !storage.roles.includes(role)) {
      throw new RbacExceptions('There is no exist a role');
    }

    return new RoleRbac(
      role,
      await this.storageRbacService.getGrant(role),
      await this.storageRbacService.getFilters(),
      paramsFilter
    );
  }

  getGrants(role: string) {
    return this.storageRbacService.getGrant(role);
  }
}
