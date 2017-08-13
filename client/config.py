import ConfigParser

cf = ConfigParser.ConfigParser()
cf.read('test.conf')

s = cf.sections()
print s
o = cf.options("command")
print o
t = cf.items("command")
print t