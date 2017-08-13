# coding: utf-8

import ConfigParser

class DeviceConfig:

    def __init__(self):
        self.cf = ConfigParser.ConfigParser()

    def Update(self, filename):
        self.cf.read(filename)
        cf = self.cf
        self.deviceName = cf.get('Default', 'deviceName')
        self.deviceID = cf.get('Default', 'deviceID')
        self.sensorList = cf.options('Sensors')
        self.sensorInfo = {}
        for i in self.sensorList:
            if cf.get('Sensors', i) == 'enable':
                self.sensorInfo[i] = {
                    'typeName': cf.get(i, 'typeName'),
                    'unit': cf.get(i, 'unit')
                }
