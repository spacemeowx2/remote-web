import websocket
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

commands = Command()
commands.add("test1")
commands.add("test2")
commands.add("test3")

print commands.dumps()

commandCatelog = CommandCatelog()
commandCatelog.add('test', commands.array())

print commandCatelog.dumps()
