let userController = ({ app,bcrypt,path,request },db) => {
   
    const pathjoin = path.join(__dirname,'../web/public/views/register');
    const pathjoin_captcha = path.join(__dirname,'../web/public/views/captcha');

    const utility = require('../utils/utility')(db,bcrypt);

    const getRegister = (req, res) => {
        res.render(pathjoin);
    }

    const postRegister = (req, res) => {
        var username = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        
        utility.getUserDetails(email).then((data)=>{
            console.log(data)
            if(data.length > 0){
                res.send('Email Already taken')
            }else{
                utility.insertUserDetails(username,email,password).then((result)=>{
                    console.log('User Created');
                    res.send('ss')
                });
            }
        })
        .catch((err)=>{
            console.log(err)
        })  
    }

    const verifyCaptcha = (req,res)=>{
       var captcha =  req.body['g-recaptcha-response'];
        if(captcha == undefined || captcha == null ||captcha == ''){
            return  res.render(pathjoin_captcha);
        }

        const secretKey = '6LdufX4UAAAAALRGuWJdarDmRl7SN18_e0gmjhet' ;
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}` ;

        request(verifyUrl, (err,response, body)=>{
            body = JSON.parse(body);
            if(body.success !== undefined && !body.success){
                return  res.render(pathjoin_captcha);
            }
            var userIp = req.ip;
            var currentDate = new Date();
            db.collection('users_ip').updateOne({ip:userIp},{hits:1,createdAt:currentDate},(err,doc)=>{
                if(err) return res.json(err);
                return  res.render(pathjoin);
            });
           
        });
    }

    return{
        getRegister,
        postRegister,
        verifyCaptcha
    }
}

module.exports = userController ;