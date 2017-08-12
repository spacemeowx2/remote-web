import json

class Command:

    def __init__(self):
        self.commands = []
        self.nextID = 0
    
    def add(self,command):
        self.commands.append({
            'cmdID': self.nextID,
            'cmdName': command
        })
        self.nextID += 1
    
    def array(self):
        return self.commands

    def dumps(self):
        return json.dumps(self.commands)

class CommandCatelog:

    def __init__(self):
        self.s = []
        self.nextID = 0

    def add(self, typeName, commands):
        self.s.append({
            'typeID': self.nextID,
            'typeName': typeName,
            'commands': commands
        })
        self.nextID += 1
    
    def array(self):
        return self.s

    def dumps(self):
        return json.dumps(self.s)

class SensorType:
    
    def __init__(self):
        self.s = []
        self.nextID = 0
    
    def add(self, typeName, unit):
        self.s.append({
            'typeID': self.nextID,
            'typeName': typeName,
            'unit': unit
        })
        self.nextID += 1
    
    def array(self):
        return self.s

    def dumps(self):
        return json.dumps(self.s)

class HandShake:

    def __init__(self):
        self.s = []
    
    def add(self, deviceId, deviceName, supportCommand, sensorType):
        self.s.append({
              'type': 'Handshake',
              'deviceName': deviceName,
              'supportCommand': supportCommand,
              'sensorTypes': sensorType
        })

    def array(self):
        return self.s
    
    def dumps(self):
        return json.dumps(self.s)

def GenTestDump():

    commands = Command()
    commands.add('test0')
    commands.add('test1')
    commands.add('test2')

    commandCatalog = CommandCatelog()
    commandCatalog.add('test', commands.array())

    sensorTypes = SensorType()
    sensorTypes.add('name0', 'unit0')
    sensorTypes.add('name1', 'unit1')
    sensorTypes.add('name2', 'unit2')

    handShake = HandShake()
    handShake.add('deviceID', 'deviceName', commandCatalog.array(), sensorTypes.array())

    return handShake.dumps()


if __name__ == '__main__':

    print GenTestDump()
