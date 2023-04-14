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

const get = async (req, res) => {
    const user_id = getCurrentId(req, res);
    res.status(200).json({
        code: 200,
        workspace_current_route: req.body.url,
        workspace_content: getProperWorkspace(user_id, req.body.url)
    });
};

module.exports.get = get;