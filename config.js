var dotenv = require('dotenv');
dotenv.config({'path':'./.test-env'});

function envConfig(){
  if(process.env.TEST){
    dotenv.config({'path':'./.test-env'});
  }else{
    dotenv.config({'path':'./.env'});
  }
}

module.exports = {envConfig:envConfig}
