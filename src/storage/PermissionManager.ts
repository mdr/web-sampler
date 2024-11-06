export class PermissionManager {
  requestNotificationPermission = async (): Promise<boolean> => (await Notification.requestPermission()) === 'granted'
}
