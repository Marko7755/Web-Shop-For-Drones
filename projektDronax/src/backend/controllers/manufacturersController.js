const getPool = require('../database/database');

module.exports = {
    manufacturerAdd: async(req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { name, country } = req.body;
            await conn.query('INSERT INTO Manufacturer(name, country) VALUES(?, ?)', [name, country]);

            conn.release();
            res.json({ message: 'Manufacturer added successfully to DB!' });

        }
        catch(error) {
            console.error('Error adding a Manufacturer', error);
            res.status(400).json({ message: 'Error adding a Manufacturer to DB' });
        }
    },

    getManufacturers: async(req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const manufacturers = await conn.query('SELECT * FROM Manufacturer');
            conn.release();
            res.json(manufacturers);
        }
        catch (error) {
            console.error('Error getting Manufacturers from DB', error);
            res.status(400).json({ message: 'Error getting Manufacturers from DB' });
        }
    },

    getManufacturer: async(req, res) => {
        try{
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idOrName } = req.query;
            const manufacturer = await conn.query("SELECT * FROM manufacturer WHERE idManufacturer = ? OR NAME = ?;", 
                [idOrName, idOrName]);

            conn.release();
            if(manufacturer.length > 0) {
                res.status(200).json(manufacturer[0]);
            }
            else {
                res.status(404).json({ message: 'No Manufacturer in DB found with that ID or Name' });
            }
            
        }
        catch (error) {
            console.error('Error getting specific Manufacturer from DB', error);
            res.status(500).json({ message: 'Error getting specific Manufacturer from DB'});
        }
    },

    editManufacturer: async(req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idManufacturer, name, country } = req.body;

            const resRows = await conn.query('UPDATE Manufacturer SET name = ?, country = ? WHERE idManufacturer = ?',
                 [name, country, idManufacturer ]);

            if (resRows.affectedRows > 0) {
                res.status(200).json({ message: `Manufacturer \"${name}\" successfully updated!`});
            }
            else {
                res.status(404).json({ message: `No Manufacturer edited in DB with ID ${idManufacturer} ` });
            }
            conn.release();
        }
        catch (error) {
            console.error('Error updating Manufacturer', error);
            res.status(400).json({ message: 'Error updating Manufacturer' });
        }
    },

    deleteManufacturer: async(req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idManufacturer } = req.params;

            const resRows = await conn.query('DELETE FROM manufacturer WHERE idManufacturer = ?;', [idManufacturer]);

            if(resRows.affectedRows) {
                res.status(200).json({ message: `Manufacturer with ID ${idManufacturer} successfully deleted!` });
            }
            else {
                res.status(404).json({ message: `No Manufacturer with ID ${idManufacturer} found in DB` });
            }

            conn.release();
        }
        catch (error) {
            console.error('Error deleting Manufacturer', error);
            res.status(400).json({ message: 'Error deleting Manufacturer' });
        }
    }


}

