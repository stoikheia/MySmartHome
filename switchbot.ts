export const SECRET_DEVELOPER_TOKEN = PropertiesService.getScriptProperties().getProperty('SECRET_DEVELOPER_TOKEN');

export const HOST = 'https://api.switch-bot.com';
export const DEVICE_LIST_PATH = '/v1.0/devices';
export const DEVICE_STATUS_PATH = '/v1.0/devices/{deviceId}/status';
export const DEVICE_CONTROL_PATH = '/v1.0/devices/{deviceId}/commands';

export const DESK_LIGHT1_ID = PropertiesService.getScriptProperties().getProperty('DESK_LIGHT1_ID');
export const OWL_PLUG_ID = PropertiesService.getScriptProperties().getProperty('OWL_PLUG_ID');

export const DEVICE_TABLE: {
  [key: string]: string | null;
} = {
  desk_light1: DESK_LIGHT1_ID,
  owl_plug: OWL_PLUG_ID,
};

export const DEVICE_META: {
  [key: string]: {
    deviceType: string;
  };
} = {
  desk_light1: {
    deviceType: 'Bulb',
  },
  owl_plug: {
    deviceType: 'Plug',
  },
};
