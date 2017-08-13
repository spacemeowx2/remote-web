import websocket
import package
import thread
import time 
import run
import random
import config
import dht

import logging
logging.basicConfig()

def on_message(ws, message):
    #d = package.LoadPackage(message)
    #res = run.PackageParser(d)
    #ws.send(package.DumpPackage(res))
    print message

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    deviceConfig = config.DeviceConfig()
    deviceConfig.Update("device.conf")

    HSPackage = package.GenSH(deviceConfig)
    print HSPackage,123
    ws.send(HSPackage)

    def SendRandomData(*args):
        while True:
            humdi, temp = dht.GetData()
            if ( humdi == -1 or temp == -1):
                continue
            dump = package.SensorDump(0, temprature)
            dump1 = package.SensorDump(1, humdi)
            ws.send(dump)
            ws.send(dump1)
            time.sleep(1)

    thread.start_new_thread(SendRandomData, ())

if __name__ == "__main__":
    ws = websocket.WebSocketApp("ws://ali.imspace.cn:3000/device",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()