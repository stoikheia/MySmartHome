import { createOutputObject_ } from './apiCommon';
import { hookExCommand_ } from './switchbotExCommands';
import { DEVICE_ID_TABLE, DEVICE_META_TABLE } from './switchbotOwnDevices';
import { switchbotControlPOST_ } from './switchbotPOST';

function outputSwitchbotControl_(deviceKey: string, params: { [key: string]: DeviceCommand.Base }): GoogleAppsScript.Content.TextOutput {
  const deviceId = DEVICE_ID_TABLE[deviceKey];
  if (deviceId == null) {
    throw Error(`Error : ${deviceKey} not found`);
  }
  const deviceMeta = DEVICE_META_TABLE[deviceKey];
  if (deviceMeta == null) {
    throw Error(`Error : ${deviceKey} metadata not found`);
  }
  if (hookExCommand_(deviceKey, deviceId, deviceMeta, params[deviceKey])) {
    return createOutputObject_('Succeeded : ' + deviceKey + ' : (Ex)' + params[deviceKey].command);
  } else {
    const response = switchbotControlPOST_(deviceId, params[deviceKey]);
    if (200 === response.getResponseCode()) {
      return createOutputObject_('Succeeded : ' + deviceKey + ' : ' + params[deviceKey].command);
    } else {
      throw Error('Failed : ' + deviceKey + ' : ' + params[deviceKey].command + ' : ' + response.getResponseCode());
    }
  }
}

export { outputSwitchbotControl_ };
