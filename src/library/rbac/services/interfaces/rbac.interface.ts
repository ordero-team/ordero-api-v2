import { IParamsFilter } from '@lib/rbac';
import { IRoleRbac } from '../../role/interfaces/role.rbac.interface';

export interface IRbac {
  getRole(role: string, builderFilter?: IParamsFilter): Promise<IRoleRbac>;
}
