import { DEVICE_CONTROL_PATH, DEVICE_STATUS_PATH } from "./switchbot";

export function createDeviceControlPath_(deviceId: string): string {
  return DEVICE_CONTROL_PATH.replace('{deviceId}', deviceId);
}

export function createDeviceStatusPath_(deviceId: string): string {
  return DEVICE_STATUS_PATH.replace('{deviceId}', deviceId);
}

export function createErrorMessageWhenFetchSwitchbotAPI_(response: GoogleAppsScript.URL_Fetch.HTTPResponse): string {
  return 'Fetch SwitchbotAPI Failed : ' + response.getResponseCode() + ' ' + response.getContentText();
}