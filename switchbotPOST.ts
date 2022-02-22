import { HOST, SECRET_DEVELOPER_TOKEN } from './switchbot';
import { createDeviceControlPath_ } from './switchbotCommon';

function switchbotControlPOST_(deviceId: string, json: DeviceCommand.Base) {
  if (SECRET_DEVELOPER_TOKEN === null) {
    throw new Error('Secret Developer Token is not found');
  }
  return UrlFetchApp.fetch(HOST + createDeviceControlPath_(deviceId), {
    method: 'post',
    headers: {
      authorization: SECRET_DEVELOPER_TOKEN,
      'content-type': 'application/json',
    },
    payload: JSON.stringify(json, null, 2),
    muteHttpExceptions: true,
  });
}

export { switchbotControlPOST_ };
