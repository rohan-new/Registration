let middleware = (packages,db)=>{
const pathjoin_captcha = packages.path.join(__dirname,'../web/public/views/captcha');
const validateIp =(req,res,next)=>{
    if(req.path === '/register' || req.path ==='/verify/captcha' ){
        next();
    }else{
        var userIp = req.ip;
        var currentDate = new Date();
        var query = {ip:userIp};
        var resultMessage = [];
       db.collection('users_ip').findOne(query,(err,doc)=>{
           if(err) return res.json(err);
           if(doc){
               let createdAt = doc.createdAt;
               let currentDate = new Date();
               if((currentDate - createdAt) < 24*60*60*1000){
                   if( doc.hits >= 3 ){
                   resultMessage.push({"message":"Validate Registration"})
                   return  res.render(pathjoin_captcha);
                }else{
                    db.collection('users_ip').updateOne({ip:userIp},{$inc:{hits:1}},(err,doc)=>{
                    if(err) return res.json(err);
                    next();
                })
            }
        }else{
            db.collection('users_ip').updateOne({ip:userIp},{$set:{hits:1,createdAt:currentDate}},(err,doc)=>{
                if(err) reject(err);
                next();
            })
        }
    }else{
        db.collection('users_ip').insertOne({ip:userIp,hits:1,createdAt:currentDate},(err,doc)=>{
            if(err) reject(err);
            next();
        })
    }
})
}    
}
return{
    validateIp
}
}

module.exports = middleware ;