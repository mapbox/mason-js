let dotenv = require('dotenv');

function envConfig(){
  if(process.env.TEST){
    dotenv.config({'path':'./.test-env'});
  }else{
    dotenv.config({'path':'./.env'});
  }
}

module.exports = {envConfig:envConfig}
