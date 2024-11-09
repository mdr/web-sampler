export interface PermissionManager {
  requestNotificationPermission(): Promise<boolean>
}
