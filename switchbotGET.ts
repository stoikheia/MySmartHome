import { HOST, DEVICE_LIST_PATH, SECRET_DEVELOPER_TOKEN } from './switchbot';
import { createDeviceStatusPath_ } from './switchbotCommon';

export function switchbotListGET_(): GoogleAppsScript.URL_Fetch.HTTPResponse {
  if (SECRET_DEVELOPER_TOKEN === null) {
    throw new Error('Secret Developer Token is not found');
  }
  const URL = HOST + DEVICE_LIST_PATH;
  return UrlFetchApp.fetch(URL, {
    method: 'get',
    headers: {
      authorization: SECRET_DEVELOPER_TOKEN,
    },
    muteHttpExceptions: true,
  });
}

export function switchbotStatusGET_(deviceId: string): GoogleAppsScript.URL_Fetch.HTTPResponse {
  if (SECRET_DEVELOPER_TOKEN === null) {
    throw new Error('Secret Developer Token is not found');
  }
  const URL = HOST + createDeviceStatusPath_(deviceId);
  return UrlFetchApp.fetch(URL, {
    method: 'get',
    headers: {
      authorization: SECRET_DEVELOPER_TOKEN,
    },
    muteHttpExceptions: true,
  });
}
