import { PermissionManager } from './PermissionManager.ts'

export class BrowserPermissionManager implements PermissionManager {
  requestNotificationPermission = async (): Promise<boolean> => (await Notification.requestPermission()) === 'granted'
}
