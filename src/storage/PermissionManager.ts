export interface PermissionManager {
  requestNotificationPermission(): Promise<boolean>
}

export class BrowserPermissionManager implements PermissionManager {
  requestNotificationPermission = async (): Promise<boolean> => (await Notification.requestPermission()) === 'granted'
}
