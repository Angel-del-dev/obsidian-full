const fs = require('fs');

const { getCurrentId } = require('./session.js');

const getProperWorkspace = (user_id, url) => {
    return fs.readdirSync(`./workspace/${user_id}/${url}`).map((name) => {
        const sections = name.split('.');
        if(sections.length == 1) return { type: 'Folder', name }; 
        else if(sections.length == 2) {
            let file = {};
            switch(sections[1].toLowerCase()) {
                case 'txt':
                    file = { type: 'Text', name };
                break;
                default:
                    file = { type: 'Unknown', name };
                break;
            }
            return file;
        }else { /* Error? */ }
        return null;
    });
};

const get = (req, res) => {
    const user_id = getCurrentId(req, res);
    res.status(200).json({
        code: 200,
        workspace_current_route: req.body.url,
        workspace_content: getProperWorkspace(user_id, req.body.url)
    });
};

const saveFile = (req, res) => {
    const user_id = getCurrentId(req, res);
    
    let err = '';
    let statusCode = 200;
    console.log(`./workspace/${user_id}${req.body.url}${req.body.fName}`);
    try {
        fs.writeFileSync(`./workspace/${user_id}${req.body.url}${req.body.fName}`, req.body.content);
    }catch (error){
        err = error;
    }

    res.status(statusCode).json({ code: statusCode, errorMsg: err });
};

const readFile = (req, res) => {
    const user_id = getCurrentId(req, res);
    
    let err = '';
    let statusCode = 200;
    let data = '';
    console.log(`./workspace/${user_id}${req.body.url}${req.body.fName}`);
    try {
       data = fs.readFileSync(`./workspace/${user_id}${req.body.url}${req.body.fName}`, { encoding: 'utf8', flag: 'r' });
    }catch (error){
        err = error;
    }

    res.status(statusCode).json({ code: statusCode, content: data, errorMsg: err });
};

module.exports.get = get;
module.exports.saveFile = saveFile;
module.exports.readFile = readFile;