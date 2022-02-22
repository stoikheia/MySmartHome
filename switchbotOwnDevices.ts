const DESK_LIGHT1_ID = PropertiesService.getScriptProperties().getProperty('DESK_LIGHT1_ID');
const OWL_PLUG_ID = PropertiesService.getScriptProperties().getProperty('OWL_PLUG_ID');

const DEVICE_ID_TABLE: DeviceTable = {
  desk_light1: DESK_LIGHT1_ID,
  owl_plug: OWL_PLUG_ID,
};

const DEVICE_META_TABLE: DeviceMetaTable = {
  desk_light1: {
    deviceType: 'Bulb',
  },
  owl_plug: {
    deviceType: 'Plug',
  },
};

export { DEVICE_META_TABLE, DEVICE_ID_TABLE };
