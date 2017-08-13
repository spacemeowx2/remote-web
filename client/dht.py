import RPi.GPIO as GPIO
import dht11
import time

# initialize GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()

# read data using pin 14
instance = dht11.DHT11(pin = 24)

def GetData():
    result = instance.read()

    if result.is_valid():
        return result.humidity, result.temperature
    else:
        return -1, -1


if __name__ == '__main__':
    while True:
        result = instance.read()

        if result.is_valid():
            print("Temperature: %d C" % result.temperature)
            print("Humidity: %d %%" % result.humidity)
        else:
            print("Error: %d" % result.error_code)
        time.sleep(1.5)
