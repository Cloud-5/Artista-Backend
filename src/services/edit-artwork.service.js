const db = require('../utils/database');

class editArtwork{
    static getArtwork(artwork_id){
        console.log(artwork_id,'edit art in service')
        return db.execute(
            `SELECT * FROM artwork WHERE artwork_id = ?`,
            [artwork_id]
        )
    }

    static update2d(artwork_id, title, price, thumbnail_url, description, category_id, is3D){
        return db.execute(
            `UPDATE artwork SET title = ?, price = ?, thumbnail_url = ?, description = ?, category_id = ?, is3D = ? WHERE artwork_id = ?`,
            [title, price, thumbnail_url, description, category_id, is3D, artwork_id]
        )
        .then(() => {
            return { artwork_id: artwork_id };
        });
    }
    static update3D(artwork_id, title, price, thumbnail_url, description, category_id, is3D, subfolder_name, modelBackground, original_url){
        return db.execute(
            `UPDATE artwork SET title = ?, price = ?, thumbnail_url = ?, description = ?, category_id = ?, is3D = ?, subfolder_name = ?, modelBackground = ?, original_url = ? WHERE artwork_id = ?`,
            [title, price, thumbnail_url, description, category_id, is3D, subfolder_name, modelBackground, original_url, artwork_id]
        )
        .then(() => {
            return { artwork_id: artwork_id };
        });
    }
}

class edittools {
    static getTools(artwork_id){
        return db.execute(
            `SELECT * FROM tools WHERE artwork_id = ?`,
            [artwork_id]
        )
    }
    static update(artwork_id, tool_name){
        return db.execute(
            `UPDATE tools SET tool_name = ? WHERE artwork_id = ?`,
            [tool_name, artwork_id]
        )
    }
    static delete(artwork_id){
        return db.execute(
            `DELETE FROM tools WHERE artwork_id = ?`,
            [artwork_id]
        )
    }
    static addTool(artworkId, tool_name) {
        return db.execute('INSERT INTO artwork_tool (artwork_id, tool_name) VALUES (?, ?)', [artworkId, tool_name]);
      }
    
}

class editTags {
    static getTags(artwork_id){
        return db.execute(
            `SELECT * FROM tags WHERE artwork_id = ?`,
            [artwork_id]
        )
    }
    static update(artwork_id, tag_name){
        return db.execute(
            `UPDATE tags SET tag_name = ? WHERE artwork_id = ?`,
            [tag_name, artwork_id]
        )
    }
    static delete(artwork_id){
        return db.execute(
            `DELETE FROM tags WHERE artwork_id = ?`,
            [artwork_id]
        )
    }
    static addTags(artworkId, tag_name){
        return db.execute('Insert into artwork_tag (artwork_id,tag_name) values (?,?)',[artworkId,tag_name]);
    }
}

class editFormts{
    static getFormats(artwork_id){
        return db.execute(
            `SELECT * FROM formats WHERE artwork_id = ?`,
            [artwork_id]
        )
    }

    static update(artwork_id, file_format_name){
        return db.execute(
            `UPDATE formats SET format_name = ? WHERE artwork_id = ?`,
            [file_format_name, artwork_id]
        )
    }
    static delete(artwork_id){
        return db.execute(
            `DELETE FROM formats WHERE artwork_id = ?`,
            [artwork_id]
        )
    }
    static addFileFormat(artworkId, file_format_name) {
        return db.execute('INSERT INTO artwork_file_format (artwork_id, file_format_name) VALUES (?, ?)', [artworkId, file_format_name]);
      }
}

module.exports = { editArtwork, edittools, editTags, editFormts };