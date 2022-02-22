import { DEVICE_CONTROL_PATH, DEVICE_STATUS_PATH } from './switchbot';

function createDeviceControlPath_(deviceId: string): string {
  return DEVICE_CONTROL_PATH.replace('{deviceId}', deviceId);
}

function createDeviceStatusPath_(deviceId: string): string {
  return DEVICE_STATUS_PATH.replace('{deviceId}', deviceId);
}

function createErrorMessageWhenFetchSwitchbotAPI_(response: GoogleAppsScript.URL_Fetch.HTTPResponse): string {
  return 'Fetch SwitchbotAPI Failed : ' + response.getResponseCode() + ' ' + response.getContentText();
}

export { createDeviceControlPath_, createDeviceStatusPath_, createErrorMessageWhenFetchSwitchbotAPI_ };
