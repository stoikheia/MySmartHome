const SECRET_DEVELOPER_TOKEN = PropertiesService.getScriptProperties().getProperty('SECRET_DEVELOPER_TOKEN');

const HOST = 'https://api.switch-bot.com';
const DEVICE_LIST_PATH = '/v1.0/devices';
const DEVICE_STATUS_PATH = '/v1.0/devices/{deviceId}/status';
const DEVICE_CONTROL_PATH = '/v1.0/devices/{deviceId}/commands';

export { SECRET_DEVELOPER_TOKEN, HOST, DEVICE_LIST_PATH, DEVICE_STATUS_PATH, DEVICE_CONTROL_PATH };
