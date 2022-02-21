declare namespace DeviceCommand {
  type Base = Any | ColorBulb | Plug;

  type Any = {
    command: string;
    parameter?: string;
    commandType?: string;
  }
  
  type ColorBulb =
    | ColorBulbTurnOn
    | ColorBulbTurnOff
    | ColorBulbTurntoggle
    | ColorBulbSetBrightness;
  
  type ColorBulbTurnOn = {
    command: 'turnOn';
    parameter: 'default';
    commandType: 'command';
  };
  type ColorBulbTurnOff = {
    command: 'turnOff';
    parameter: 'default';
    commandType: 'command';
  };
  type ColorBulbTurntoggle = {
    command: 'toggle';
    parameter: 'default';
    commandType: 'command';
  };
  type ColorBulbSetBrightness = {
    command: 'setBrightness';
    parameter: string; // "{0-255}:{0-255}:{0-255}"
    commandType: 'command';
  };
  type ColorBulbSetColorTemperature = {
    command: 'setColorTemperature';
    parameter: string; // "{2700-6500}"
    commandType: 'command';
  };
  
  type Plug = PlugTurnOn | PlugTurnOff;
  
  type PlugTurnOn = {
    command: 'turnOn';
    parameter: 'default';
    commandType: 'command';
  };
  type PlugTurnOff = {
    command: 'turnOff';
    parameter: 'default';
    commandType: 'command';
  };
}