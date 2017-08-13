import websocket
import package
import thread
import time 
import run
import dht

def on_message(ws, message):
    #d = package.LoadPackage(message)
    #res = run.PackageParser(d)
    #ws.send(package.DumpPackage(res))

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    def run(*args):
        dump = package.GenTestArrayAndDump()
        ws.send(dump)
        time.sleep(1)
        temp = dht.GetTemp()
        dump = package.SensorDump(1, temp)
        ws.send(dump)
        ws.close()
        print("thread terminating...")
    thread.start_new_thread(run, ())

if __name__ == "__main__":
    ws = websocket.WebSocketApp("ws://192.168.199.152:3000/device",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()