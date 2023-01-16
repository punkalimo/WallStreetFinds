const User = require('../models/userModel');
const Portfolio = require('../models/portfolio');


const createPortfolio = async(req,res)=>{
    console.log(req.cookies.token)
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
            if(err){
                console.log(err);
                res.sendStatus(500).send("Please login");
                return;
            }
           const user = await User.findById(decoded.userID);
            if(user){
                const userID = decoded.userID;
                const name = req.body.name;
                const create = await Portfolio.create({
                    name, userID
                });
                if(create){
                    res.send(create);
                }else{
                    res.send(400)
                }
                
            }else{
                res.sendStatus(404);
            }
        })
    }else{
        res.status(400).send("invalid session. Please login!")
    }
}
module.exports = createPortfolio