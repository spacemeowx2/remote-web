#import lirc                         
import time

#sockid = lirc.init('test')

def Cmd(d):
    import os
    isSuccess = False
    info = ''
    if ( os.system('echo helloworld') == 0 ):
        isSuccess = True
    return {
        'type': 'UserCommandResponse',
        'ID': d['ID'],
        'success': isSuccess,
        'info': info 
        }

def PackageParser(d):

    if ( d['type'] == 'UserCommand'):
        return Cmd(d)
    
    else:
        return {}

if __name__ == '__main__':
    while True:                         
        #time.sleep(1)                      
        #print 'hi'                     
        for code in lirc.nextcode():            
            print code                  
            if code == 'A':                 
                run('aircond', 'KEY_OPEN')      
            elif code == 'B':               
                run('aircond', 'KEY_CLOSE')     