import websocket
import json

class SurppotCommand:

    def __init__(self):
        self.commands = []
        self.nextID = 0
    
    def add(self, typeName, command):
        return self.commands
    
    def dumps():
        return 1

s = '{"TypeID":123}'
z = json.loads(s)
x = json.dumps(z)

print z
print x 
