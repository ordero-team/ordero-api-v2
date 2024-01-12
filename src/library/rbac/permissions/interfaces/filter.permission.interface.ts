export interface IFilterPermission {
  // pass only via @Permissions
  can(params?: any[]): boolean;
}
