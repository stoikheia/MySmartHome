/*
--------------------------------------------------------------------------------------------
  Definition of Extended Command

  1. Plug.toggle // Added 'toggle' command for Plug.
 */

import { switchbotStatusGET_ } from './switchbotGET';
import { switchbotControlPOST_ } from './switchbotPOST';

type ExCommands = [
  {
    name: string;
    type: string;
    command: string;
    exec: (deviceKey: string, deviceId: string, deviceMeta: DeviceMeta) => void;
  },
];

const exCommands: ExCommands = [
  {
    name: 'togglePlug',
    type: 'plug',
    command: 'toggle',
    exec: togglePlug_,
  },
];

function hookExCommand_(deviceKey: string, deviceId: string, deviceMeta: DeviceMeta, param: DeviceCommand.Base) {
  return exCommands.some((e) => {
    if (deviceMeta.deviceType === e.type && param.command === e.command) {
      e.exec(deviceKey, deviceId, deviceMeta);
      return true;
    }
    return false;
  });
}

function togglePlug_(deviceKey: string, deviceId: string, deviceMeta: DeviceMeta) {
  const command = {
    command: '',
    commandType: 'command',
    parameter: 'default',
  };

  const response1 = switchbotStatusGET_(deviceId);
  if (200 === response1.getResponseCode()) {
    console.log('DEBUG : ' + deviceKey + ' : (Ex)toggle : fetch Status : ' + response1.getContentText());
    const status = JSON.parse(response1.getContentText());
    command.command = status.body.power.toLowerCase() === 'on' ? 'turnOff' : 'turnOn';
  } else {
    throw new Error('Failed : ' + deviceKey + ' : (Ex)toggle : fetch Status : ' + response1.getResponseCode());
  }

  const response2 = switchbotControlPOST_(deviceId, command);
  if (200 !== response2.getResponseCode()) {
    throw new Error('Failed : ' + deviceKey + ' : (Ex)toggle : post command : ' + response2.getResponseCode());
  }
}

export { hookExCommand_ };
