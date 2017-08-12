import websocket
import json

class Command:

    def __init__(self):
        self.commands = []
    
    def add(self,command):
        self.commands.append(command)
    
    def dumps(self):
        s = []
        for i in range(len(self.commands)):
            s.append({
                'cmdID': i,
                'cmdName': self.commands[i]
            })
        return json.dumps(s)

class SurppotCommand:

    def __init__(self):
        self.commands = []
        self.nextID = 0
    
    def add(self, typeName, command):
        return self.commands
    
    def dumps(self):
        return 1

commands = Command()
commands.add("test1")
commands.add("test2")
commands.add("test3")

print commands.dumps()
