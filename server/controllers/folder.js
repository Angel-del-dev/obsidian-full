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
    
    try {
       data = fs.readFileSync(`./workspace/${user_id}${req.body.url}${req.body.fName}`, { encoding: 'utf8', flag: 'r' });
    }catch (error){
        err = error;
    }

    res.status(statusCode).json({ code: statusCode, content: data, errorMsg: err });
};

const createFolder = (req, res) => {
    const user_id = getCurrentId(req, res);
    let statusCode = 200;
    let err = '';
    let msg = '';
    let code = 200;
    try {
        const dir = `./workspace/${user_id}${req.body.url}${req.body.folderName.trim()}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            msg = 'Folder created succesfully';
        }else {
            // Folder already existing
            statusCode = 409;
            msg = 'The folder has already been created';
        }
    }catch(error) {
        msg = error;
        err = error;
        code = 501;
    }

    res.status(code).json({ code: statusCode, msg, error: err});
};

const removeFolder = (req, res) =>{
    const user_id = getCurrentId(req, res);
    let statusCode = 200;
    let err = '';
    let msg = '';
    let code = 200;
    try {
        const dir = `./workspace/${user_id}${req.body.url}${req.body.name.trim()}`;
        switch(req.body.type){
            case 'Folder':
                if (fs.existsSync(dir)){
                    console.log('Folder exists');
                    fs.rmSync(dir, { recursive: true, force: true });
                    msg = 'Folder removed succesfully';
                }else {
                    // Folder doesn't exist
                    statusCode = 404;
                    msg = 'Folder not found';
                }
            break;
            default:
                fs.unlinkSync(dir);
            break;
        }
    }catch(error) {
        msg = error;
        err = error;
        code = 501;
    }

    res.status(code).json({ code: statusCode, msg, error: err});
}

const createFile = (req, res) => {
    const user_id = getCurrentId(req, res);
    
    let err = '';
    let statusCode = 200;
    
    try {
        const dir = `./workspace/${user_id}${req.body.url}${req.body.fileName.trim()}`;
        if (!fs.existsSync(dir)){
            fs.writeFileSync(dir, '');
            msg = 'File created succesfully';
        }else {
            // File already existing
            statusCode = 409;
            msg = 'The file has already been created';
        }
    }catch (error){
        err = error;
    }

    res.status(statusCode).json({ code: statusCode, errorMsg: err });
};

const rename = (req, res) => {
    const user_id = getCurrentId(req, res);
    
    let err = '';
    let statusCode = 200;
    
    try {
        const old_name = `./workspace/${user_id}${req.body.url}${req.body.oldName.trim()}`;
        const new_name = `./workspace/${user_id}${req.body.url}${req.body.newName.trim()}`;
        if (fs.existsSync(old_name)){
            fs.renameSync(old_name, new_name)
            msg = 'Renamed succesfully';
        }else {
            // File doesn't exist
            statusCode = 404;
            msg = "The element doesn't exist";
        }
    }catch (error){
        err = error;
    }

    res.status(statusCode).json({ code: statusCode, errorMsg: err });
};

module.exports = {
    get,
    saveFile,
    readFile,
    createFolder,
    removeFolder,
    createFile,
    rename
}