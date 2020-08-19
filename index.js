const express = require('express');
const fs = require('fs');
var cors = require('cors') 
const app = express();
app.use(express.json())
app.use(cors())
var obj = []
var users;
user = fs.readFile('./data.json',"utf8", (err, data) => {
    if(err){
        console.log(err)
    }else{
         users = JSON.parse(data)
         console.log(typeof(users))
    }
})
 // get All Data
app.get('/allData',(req,res)=>{
    fs.readFile('./data.json',"utf8", (err, data) => {
        if(err){
            console.log(err)
        }else{
            var a = JSON.parse(data)
            console.log(typeof(a))
            res.send(a)
        }
    })
})

// Add Data in file

app.post('/add',(req,res)=>{
    console.log(req.body)
    fs.access('data.json', (err) => { // search for file
        if (err) { // if file not exist creating file
            console.log("The file does not exist.");
            fs.writeFile('./data.json',JSON.stringify([req.body],null,2), err => {
                console.log("dd")
                if (err) {
                    console.log('Error writing file', err)
                    
                }
                else { // write file
                    console.log('Successfully wrote file')
                    console.log(req.body)
                    return res.send(req.body)
                }
            })
        } else { // Checking id in file
            for(let i = 0;i<users.length;i++){
                if(users[i].id === req.body.id){
                    return res.json(0);
                }
            }
            var a = req.body;
            console.log("users:",users)
            users.push(a); 
            // adding object in file
            fs.writeFile("./data.json",JSON.stringify(users,null,2), err=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('Successfully upadated file')
                    console.log(req.body)
                    return res.send(req.body)
                }
            })   
        }
    });
});

// Delete data

app.post('/deleteid',(req,res)=>{
    var d= -1; // id should not less than 0
    for(let i = 0;i<users.length;i++){
        if(users[i].id === req.body.id){ // checking id in file
            d = i; // saving to id to var d
        }
    }
    if(d>=0){
        console.log(users[d])
            users.splice(d,1); // deleting file
            fs.writeFile("./data.json",JSON.stringify(users,null,2), err=>{ // updaing file
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Deleted data of Id: `$users[i]`")
                    // console.log(req.body)
                    res.json("Data Successfully Deleted")
                }
            })

    }
    else{ // id not found
        return res.json(0);
    }
})

// Edit data

app.post('/editid',(req,res)=>{
    var d= -1;
    for(let i=0;i<users.length;i++){
        if(users[i].id === req.body.id){
            d = i;
        }
    }
    if(d>=0){
        users[d] = req.body; // saving to new data
        fs.writeFile("./data.json",JSON.stringify(users,null,2), err=>{ 
            if(err){
                console.log(err)
            }
            else{
                console.log('Successfully modified file')
                res.json(users[d]) // return data
            }
        })
    }
    else{
        return res.json(0);
    }
})

//Fetch Data

app.post('/getData',(req,res)=>{
    var d = -1;
    console.log(req.body)
    for(let i=0;i<users.length;i++){
        if(users[i].id === req.body.id){
            d = i;
        }
    }
    if(d>=0){

        return res.json(users[d]) // return Data
    }
    else {
        return res.json(0)
    }
})
app.listen(9000); // App running at port 9000