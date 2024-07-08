const { render } = require('ejs');
const express = require('express');
const app = express() ;
const path = require('path');
const fs = require('fs');
const { log } = require('console');

app.set('view engine' , 'ejs')
app.use(express.static(path.join(__dirname , 'public'))) ;
app.use(express.json());
app.use(express.urlencoded({extended: true})) ;

app.get('/home' ,function(req , res) {
  var arr = [] ;
  fs.readdir( './files' , function(err , files){

    if(err) return res.send(err) ;
    else{
      files.forEach(function(filename){
        let data = fs.readFileSync(`./files/${filename}`);
        arr.push({filename , data})
        
      })
      res.render('index' , {files: arr})
    }
   
  })  
 
})

app.post('/create' , function(req , res) {
    fs.writeFile(`./files/${req.body.filename.split(' ').join('')}.txt` , req.body.filedata ,function(err){
    if(err) return res.send(err) ;
    else res.redirect("/home")
    })
 
}) 
app.get('/create' ,function(req , res){
    res.render('create')
})  
// app.get('/update' ,function(req , res){
//   res.render('edit')
// })  

app.post('/update/:filename' , function(req , res){
  fs.writeFile(`./files/${req.params.filename}` , req.body.filedata , function(err){
    if(err) return res.send(err) ;
    else res.redirect("/home") 
  }) 
})

app.get('/delete/:filename' , function(req, res ){
  fs.unlink(`./files/${req.params.filename}`, function(err){
    if(err) return res.send(err);
    else  res.redirect('/home');
  })
})
app.get('/edit/:filename' , function(req, res ){
  fs.readFile(`./files/${req.params.filename}` , function(err , filedata){
    res.render('edit' , {filename : req.params.filename ,filedata})
  })
  

})

app.listen(3000)
