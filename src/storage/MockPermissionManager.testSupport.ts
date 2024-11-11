import { PermissionManager } from './PermissionManager.ts'

export class MockPermissionManager implements PermissionManager {
  notificationPermissionGranted: boolean = false

  constructor(private readonly grantNotificationPermission: boolean = true) {}

  requestNotificationPermission = (): Promise<boolean> => {
    if (this.grantNotificationPermission) {
      this.notificationPermissionGranted = true
    }
    return Promise.resolve(this.notificationPermissionGranted)
  }
}
