const { default: makeWASocket, DisconnectReason, AnyMessageContent, delay, useSingleFileAuthState } = require('@adiwajshing/baileys-md')
const {Boom} = require("@hapi/boom")
const pino = require("pino")
const { state, saveState } = useSingleFileAuthState('./ichi.json')
const color = require('./lib/color')
const figlet = require('figlet')
const lolcatjs = require('lolcatjs')
const fs = require("fs")

//Thanks To Nurutomo And Tobz
require('./message/ichi.js')
nocache('./message/ichi.js', module => console.log(`'${module}' Updated!`))

 

    async function startSock()  {
    
        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: true,
            auth: state,
         
            getMessage: async key => {
                return {
                    conversation: 'hello'
                }
            }
        })
        sock.ev.on('messages.upsert', async m => {
            if (!m.messages) return
            const msg = m.messages[0]
            require('./message/ichi.js')(sock, msg)
        })
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log('connection closed, try to restart')
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
            ? start()
            : console.log('Wa web terlogout.')
        }
    })
             
    
        sock.ev.on('creds.update', () => saveState)
        console.log('------------------------------------------------')
        lolcatjs.fromString(color(figlet.textSync('I C H I', { horizontalLayout: 'full' })))
        console.log('------------------------------------------------')
        lolcatjs.fromString('[SERVER] Server Started!')
 
        return sock
    }
    
    startSock()
    
   /**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

  

// run in main file
