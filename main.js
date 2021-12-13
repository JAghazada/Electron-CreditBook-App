
const electron = require("electron")
const ejse = require('ejs-electron')
const path = require("path");
const sqlite3 = require('sqlite3');
const url = require("url")
const { BrowserWindow, Menu, ipcMain, webContents } = require("electron");
const { addWindowFunc, searchWindowFunc, addPaymentWindow, addEditUserWindow } = require("./windows/addModalWindow");
const { insertData, openDb, closeDb,createTable } = require("./helpers/orm");
const {app} = electron
let mainWindow,searchWindow,paymentWindow,editUserWindow;
//sql coonection 
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
//when state ready :
var data = []
function getAllData(table_name){
    const db = openDb()
    db.each(`SELECT * FROM ${table_name}`,(err,row)=>{
            if(err){
            }
            data.push(row)
                
    })
    closeDb(db)



}


getAllData('users')
app.on("ready",()=>{
    var specificData = []
    const getSpecificData2=(table_name,values)=>{
        values = values[0]
        const field = values.split(':')[0]
        const value = values.split(':')[1]
         const db =  openDb()
         db.each(`SELECT * FROM ${table_name} Where(${field}='${value}') `,async(err,row)=>{
                 specificData.push(row)
                console.log(specificData)
                if(specificData.length === 0 ){
                    
                }

                
        })}
    const deleteUser=(table_name,datas)=>{
        var db = openDb()
        var query = ''
        datas.map(value=>{
            stdt = value.split(':').join('=')
            
            if(value!==datas[datas.length-1]){
                query+=stdt + " and "
            }else{
                query+=stdt
            }
       })
    //    console.log(query)
    console.log(`Delete From ${table_name} WHERE (${query})`)

       db.each(`Delete From ${table_name} WHERE (${query})`,(err,rows)=>{
           console.log(err)
       })
       closeDb(db)
    }


        
    const getSpecificData=(table_name,values,searchWindow)=>{
        values = values[0]
        const field = values.split(':')[0]
        const value = values.split(':')[1]
         const db =  openDb()
         db.each(`SELECT * FROM ${table_name} Where(${field}='${value}') `,async(err,row)=>{
                 specificData.push(row)
                console.log(specificData)

                
        })

            setTimeout(()=>{
                console.log(specificData)
                 closeDb(db)
                //  console.log(searchWindow)
                searchWindow.webContents.send('key:youruser', specificData)
                specificData = []
            },1000)
    
    
    }
    
    createTable('users',['id:INTEGER PRIMARY KEY  AUTOINCREMENT','Ad:TEXT','Soyad:TEXT','Borc:INTEGER','Telefon:Text','BaslangicTarixi:Text','SonOdenisTarixi:Text','SonOdenisMiqdari:Text','Qeyd:Text','ElaveOlunmaTarixi:Text'])
   
    mainWindow = new BrowserWindow({
        webPreferences:{
                nodeIntegration: true,
                contextIsolation: false, 
            }
        });
        mainWindow.loadURL(
            url.format({
                pathname:path.join(__dirname,'/views/main.ejs'),
                protocol:'file:',
                slashes:true
            })
        )

        const mainMenu = Menu.buildFromTemplate(menuTemplate)

        Menu.setApplicationMenu(mainMenu)
        mainWindow.webContents.on('did-finish-load', function () {
            mainWindow.webContents.send('key:users', data);
            data = []
        });

        ipcMain.on('key:addWindow',()=>{
            addWindowFunc()

    
        })
        ipcMain.on('key:addUser',async(err,data)=>{
            
            const {name,specialInfo,surname,credit,date,phone,lastpayment,lastpaymentTime,addedTime} = data
            insertData('users',[`Ad:${name}`,`Soyad:${surname}`,`Telefon:${phone}`,`Borc:${credit}`,`BaslangicTarixi:${date}`,`SonOdenisTarixi:${lastpaymentTime}`,`SonOdenisMiqdari:${lastpayment}`,`ElaveOlunmaTarixi:${addedTime}`,`Qeyd:${specialInfo}`])
        })
        ipcMain.on('key:getUser',async(err,data)=>{
                  searchWindow = searchWindowFunc()
                const {field,value} = data
                console.log(field,value)
                getSpecificData('users',[`${field}:${value}`],searchWindow)
        })
        ipcMain.on('key:payCredit',(err,data)=>{
            
            paymentWindow = addPaymentWindow()
            paymentWindow.webContents.on('did-finish-load', function () {
                paymentWindow.webContents.send('key:paymentData',data)
                data={}

            })
            
            // getSpecificData2('users',[`id:${id}`,`Ad:${name}`,`Soyad:${surname}`,`Telefon:${phone}`],null)
            
        })
        ipcMain.on('key:changeCredit',async(err,data)=>{
            const {timeZone,window,id,Ad,Soyad,Telefon,Borc,payment} = data
                const yeni_borc = parseInt(Borc) - parseInt(payment)
                const db = openDb()
                 db.each(`UPDATE users SET Borc=${yeni_borc} WHERE id='${id}' and Ad='${Ad}' and Soyad='${Soyad}' and Telefon='${Telefon}' and Borc='${Borc}'`)
                 db.each (`UPDATE users SET SonOdenisTarixi=${timeZone} WHERE id='${id}' and Ad='${Ad}' and Soyad='${Soyad}' and Telefon='${Telefon}' and Borc='${yeni_borc}'`)
                db.each(`UPDATE users SET SonOdenisMiqdari=${parseInt(payment)} WHERE id='${id}' and Ad='${Ad}' and Soyad='${Soyad}' and Telefon='${Telefon}' and Borc='${yeni_borc}'`)

                 closeDb(db)
                 console.log(window)
                 console.log(window==="getUser")
                if(window==="getUser"){
                    searchWindow.webContents.send('key:changeCreditMssg',"Uğurla Dəyişdirildi!")

                } 
                if(window==="main"){
                    mainWindow.webContents.send('key:changeCreditMssg',"Uğurla Dəyişdirildi!")
                }

                // db.get(`UPDATE users SET SonOdenisTarixi=${(new Date(Date.now())).toISOString().split('T')[0]} WHERE id='${id}' and Ad='${Ad}' and Soyad='${Soyad}' and Telefon='${Telefon}' and Borc='${Borc}'`)
                // closeDb(db)
                
                getAllData('users')
                mainWindow.webContents.send('key:users', data);
                
                 
                // db.run(`UPDATE users SET Borc=${yeni_borc} WHERE id='${id}' and Ad='${Ad}' and Soyad='${Soyad}' and Telefon='${Telefon}' and Borc='${Borc}';UPDATE users SET SonOdenisTarixi=${(new Date(Date.now())).toISOString().split('T')[0]} WHERE id='${id}' and Ad='${Ad}' and Soyad='${Soyad}' and Telefon='${Telefon}' and Borc='${Borc}';`)
        })
        
        ipcMain.on('key:editUser',(err,data)=>{
            
            editUserWindow=addEditUserWindow() ;
            editUserWindow.webContents.on('did-finish-load',function(){
                editUserWindow.webContents.send('key:userDataForEdit',data)
                data={}
            })
        })
        ipcMain.on('key:changeUserInfo',(err,data)=>{
            const {window ,id,Ad,Soyad,Telefon,Borc,BaslangicTarixi,SonOdenisMiqdari,SonOdenisTarixi,Qeyd} = data
            const db =openDb()
              
                db.each(`UPDATE users SET Ad='${Ad}' , Soyad='${Soyad}' , Telefon='${Telefon}' , Borc='${Borc}' , BaslangicTarixi='${BaslangicTarixi}' , SonOdenisMiqdari='${SonOdenisMiqdari}' , SonOdenisTarixi='${SonOdenisTarixi}' , Qeyd='${Qeyd}'  WHERE id=${id}`)    
                // console.log(`UPDATE users SET  Ad='${Ad}' , Soyad='${Soyad}' and Telefon='${Telefon}' and Borc='${Borc}' and BaslangicTarixi='${BaslangicTarixi}' and SonOdenisMiqdari='${SonOdenisMiqdari}' and SonOdenisTarixi='${SonOdenisTarixi}' and Qeyd='${Qeyd}'  WHERE id=${id}`)    
            closeDb(db)
            if(window==="getUser"){
                searchWindow.webContents.send('key:changeCreditMssg',"Uğurla Dəyişdirildi!")

            } 
            if(window==="main"){
                mainWindow.webContents.send('key:changeCreditMssg',"Uğurla Dəyişdirildi!")
            }

        })
        ipcMain.on('key:deleteUser',(err,data)=>{
            const {window, id,Ad,Soyad,Telefon,Borc} = data
            deleteUser('users',[`id:${id}`,`Ad:'${Ad}'`,`Soyad:'${Soyad}'`,`Telefon:'${Telefon}'`,`Borc:'${Borc}'`])
            if(window==="getUser"){
                searchWindow.webContents.send('key:changeCreditMssg',"Uğurla Silindi!")

            } 
            if(window==="main"){
                mainWindow.webContents.send('key:changeCreditMssg',"Uğurla Silindi!")
            }
        })
    })




//menu template:
const menuTemplate = [
    
    {
        label:"Qisa Yollar",
        submenu : [
            {
                label:"Əlavə Et",
                accelerator:process.platform === 'darwin' ? 'Command + D' : 'Ctrl + D',
                click(){
                    addWindowFunc()
                }
            },
            {
                label:"Çıxış",
                accelerator:process.platform === 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                role:'quit'
            },
            {
                label:"Restart",
                accelerator:process.platform === 'darwin' ? 'Command + R' : 'Ctrl + R',
                click(){
                    app.relaunch()
                    app.exit()
                }

        
            },
           
        ]

    },

    {
        label :"Developer Tools",
        accelerator:process.platform === 'darwin' ? 'Command + X' : 'Ctrl + X',
        click(item,focusedWindow){
            focusedWindow.toggleDevTools()
        }
    }
    
]
