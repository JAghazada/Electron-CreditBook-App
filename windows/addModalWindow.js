const electron = require("electron")
const path = require("path")
const url = require("url")
const { BrowserWindow, Menu } = require("electron");
const {app} = electron
let addModalWindow ,searchWindow,paymentWindow ,editUserWindow;
function addWindowFunc(){
    addModalWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false, 
        },
        width:800,
        height:400,
        title:"MAIN"
    })
    addModalWindow.loadURL(
    url.format({
        pathname:path.join(__dirname,'/../views/add.ejs'),
        slashes:true,
        protocol:'file:'
    })
)
}
function searchWindowFunc(){
    searchWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false, 
        },
        width:800,
        height:400,
        title:"Search User"
    })
    searchWindow.loadURL(
    url.format({
        pathname:path.join(__dirname,'/../views/getUser.ejs'),
        slashes:true,
        protocol:'file:'
    })
)
    return searchWindow
}
function addPaymentWindow(){
    paymentWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false, 
        },
        width:800,
        height:400,
        title:"User Payment"
    })
    paymentWindow.loadURL(
    url.format({
        pathname:path.join(__dirname,'/../views/payment.ejs'),
        slashes:true,
        protocol:'file:'
    })
)
    return paymentWindow
}
function addEditUserWindow(){
    editUserWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false, 
        },
        width:800,
        height:400,
        title:"Edit User"
    })
    editUserWindow.loadURL(
    url.format({
        pathname:path.join(__dirname,'/../views/editUser.ejs'),
        slashes:true,
        protocol:'file:'
    })
)
    return editUserWindow
}
module.exports ={
    addWindowFunc,
    searchWindowFunc,
    addPaymentWindow,
    addEditUserWindow
}