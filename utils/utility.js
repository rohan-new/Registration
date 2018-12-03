let util = (db,bcrypt)=>{

    const saltRounds = 10;

    const getUserDetails = (mail)=>{
        return new Promise((resolve, reject) =>{
            db.collection('users').findOne({mail:mail},(err,doc)=>{
                var resultMessage =[];
                if(err) reject (err);
                if(doc){
                    resultMessage.push({"message":"Email already exists"});
                    resolve(resultMessage);
                }else{
                   resolve(resultMessage);
                }
            })    
        })
    }

    const insertUserDetails =(name,mail,password)=>{
        return new Promise((resolve,reject)=>{
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if(err) reject(err);
                db.collection('users').insertOne({name:name,mail:mail,password:hash},(err,result)=>{
                    if(err) reject (err);
                    resolve();
                })
            });
        })
    }


    return{
        getUserDetails,
        insertUserDetails
    }
}

module.exports = util;