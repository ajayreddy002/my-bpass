'use strict';

const base64Decode = async (data) => {
    let buff = new Buffer(data, 'base64');
    return buff.toString('ascii');
}

export default { 
    base64Decode
}