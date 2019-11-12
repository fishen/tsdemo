
import fs from 'fs-extra';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const config = Object.assign({
    "server": {
        "host": "127.0.0.1",
        "port": 8080
    },
}, fs.readJSONSync(path.join(__dirname, `${env}.json`)))

export default config;