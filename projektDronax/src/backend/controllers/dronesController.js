const { identifierToKeywordKind, isDotDotDotToken } = require('typescript');
const getPool = require('../database/database');

module.exports = {
    droneAdd: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idManufacturer, droneName, type, about, manufacturingDate, price } = req.body;
            const pictures = req.files ? req.files.map(file => file.filename) : [];
            
            const droneQuery = await conn.query('INSERT INTO Drone (idManufacturer, name, type, about, manufacturingDate, price, isArchived) VALUES (?, ?, ?, ?, ?, ?, 0)',
                [idManufacturer, droneName, type, about, manufacturingDate, price]);

            if(pictures.length > 0) {
                for (let picture of pictures) {
                    await conn.query('INSERT INTO Drone_Image (idDrone, imageUrl) VALUES (?, ?)', [droneQuery.insertId, picture]);
                }
            }
                           
            conn.release();
            res.json({ message: 'Drone added successfully to DB', droneId: droneQuery.insertId });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding a drone to DB' });
        }
    },

    /* getDrone: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
    
            const { idOrName } = req.params;
    
            // Query to fetch drone details along with manufacturer name
            const droneRows = await conn.query(`
                SELECT d.*, m.name AS manufacturerName 
                FROM Drone d
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                WHERE d.idDrone = ? OR d.name = ?;
            `, [idOrName, idOrName]);
    
            if (!droneRows || droneRows.length === 0) {
                conn.release();
                return res.status(404).json({ message: 'No Drone in DB found with that ID or Name' });
            }
    
            const drone = droneRows[0];
    
            // Fetch associated images
            const imageRows = await conn.query('SELECT imageUrl FROM Drone_Image WHERE idDrone = ?', [drone.idDrone]);
            const images = imageRows.map(row => row.imageUrl);
    
            conn.release();
            res.json({ ...drone, pictures: images });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving drone details' });
        }
    }, */



    getDrone: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
    
            const { idOrName } = req.params;
    
            // Dohvati podatke o dronu pomoću ID-a ili imena
            const [drone] = await conn.query(`
                SELECT d.*, m.name AS manufacturerName 
                FROM Drone d
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                WHERE d.idDrone = ? OR d.name = ?;
            `, [idOrName, idOrName]);
    
            if (!drone) {
                conn.release();
                return res.status(404).json({ message: "Drone not found" });
            }
    
            // Dohvati sve aktivne popuste za dron
            const discounts = await conn.query(`
                SELECT dd.idDiscount, dd.lastDiscountDate, dd.isActive, di.amount, di.startDate, di.endDate 
                FROM Drone_Discount dd
                JOIN Discount di ON dd.idDiscount = di.idDiscount
                WHERE dd.idDrone = ? AND dd.isActive = 1;
            `, [drone.idDrone]);
    
            // Izračun snižene cijene primjenom svih aktivnih popusta
            let finalPrice = drone.price;
            discounts.forEach(discount => {
                finalPrice -= (finalPrice * discount.amount) / 100;
            });
    
            drone.finalPrice = Math.max(finalPrice, 0); // Osigurava da cijena ne ide ispod 0
            drone.discounts = discounts;
    
            // Dohvati slike drona
            const imageRows = await conn.query('SELECT imageUrl FROM Drone_Image WHERE idDrone = ?', [drone.idDrone]);
            const images = imageRows.map(row => row.imageUrl);
    
            drone.pictures = images; // Dodaj slike u objekt drona
    
            conn.release();
            res.json(drone);
        } catch (error) {
            console.error('Error fetching drone details:', error);
            res.status(500).json({ message: 'Error fetching drone details' });
        }
    },

    /* getAllDrones: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const drones = await conn.query(`
                SELECT d.idDrone, d.name AS droneName, m.name AS manufacturerName, d.price, 
                MIN(dI.imageUrl) AS imageUrl
                FROM drone d 
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                LEFT JOIN Drone_Image dI ON d.idDrone = dI.idDrone
                GROUP BY d.idDrone, droneName, manufacturerName, d.price;
            `);

            conn.release();
            res.json(drones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving drones from DB' });
        }
    }, */

    getAllDrones: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
    
            // Fetch all drones with their basic details
            const drones = await conn.query(`
                SELECT d.idDrone, d.name AS droneName, m.name AS manufacturerName, d.price, 
                       MIN(dI.imageUrl) AS imageUrl
                FROM drone d 
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                LEFT JOIN Drone_Image dI ON d.idDrone = dI.idDrone
                GROUP BY d.idDrone, droneName, manufacturerName, d.price;
            `);
    
            // Process each drone to include discounts
            for (let drone of drones) {
                // Fetch active discounts for each drone
                const discounts = await conn.query(`
                    SELECT di.amount
                    FROM Drone_Discount dd
                    JOIN Discount di ON dd.idDiscount = di.idDiscount
                    WHERE dd.idDrone = ? AND dd.isActive = 1;
                `, [drone.idDrone]);
    
                // Apply discounts to calculate final price
                let finalPrice = drone.price;
                discounts.forEach(discount => {
                    finalPrice -= (finalPrice * discount.amount) / 100;
                });
    
                // Ensure price doesn't go below 0
                drone.finalPrice = Math.max(finalPrice, 0);
                drone.discounts = discounts.length > 0 ? discounts : [];
            }
    
            conn.release();
            res.json(drones);
        } catch (error) {
            console.error('Error retrieving drones:', error);
            res.status(500).json({ message: 'Error retrieving drones from DB' });
        }
    },
    

    editDrone: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
            
            const { idDrone } = req.params;
            const { idManufacturer, droneName, type, about, manufacturingDate, price } = req.body;
            const pictures = req.files ? req.files.map(file => file.filename) : [];

            // Update drone details
            await conn.query(
                `UPDATE Drone 
                 SET idManufacturer = ?, name = ?, type = ?, about = ?, manufacturingDate = ?, price = ? 
                 WHERE idDrone = ?`,
                [idManufacturer, droneName, type, about, manufacturingDate, price, idDrone]
            );

            // If new pictures are provided, update Drone_Image table
            if (pictures.length > 0) {
                // Delete old images
                await conn.query('DELETE FROM Drone_Image WHERE idDrone = ?', [idDrone]);

                // Insert new images
                for (let picture of pictures) {
                    await conn.query('INSERT INTO Drone_Image (idDrone, imageUrl) VALUES (?, ?)', [idDrone, picture]);
                }
            }

            conn.release();
            res.json({ message: 'Drone updated successfully', droneName: droneName });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating drone' });
        }
    },

    deleteDrone : async(req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idToDelete } = req.params;

            const resRows = await conn.query('DELETE FROM drone WHERE idDrone = ?;', [idToDelete]);

            if(resRows.affectedRows) {
                res.status(200).json({ message: `Drone with ID ${idToDelete} successfully deleted!` });
            }
            else {
                res.status(404).json({ message: `No Drone with ID ${idToDelete} found in DB` });
            }

            conn.release();

        }
        catch (error) {
            console.error('Error deleting Drone', error);
            res.status(400).json({ message: 'Error deleting Drone' });
        }
    },

    getDiscountedDrones: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
    
            const discountedDrones = await conn.query(`
                SELECT d.idDrone, d.name AS droneName, m.name AS manufacturerName, d.price, 
                       MIN(dI.imageUrl) AS imageUrl, ds.amount
                FROM drone d 
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                LEFT JOIN Drone_Image dI ON d.idDrone = dI.idDrone
                JOIN Drone_Discount dd ON d.idDrone = dd.idDrone
                JOIN Discount ds ON dd.idDiscount = ds.idDiscount
                WHERE dd.isActive = 1
                GROUP BY d.idDrone, droneName, manufacturerName, d.price, ds.amount; 
            `);
    
            // Calculate final prices
            discountedDrones.forEach(drone => {
                drone.finalPrice = drone.price - (drone.price * drone.amount) / 100;
            });
    
            conn.release();
            res.json(discountedDrones);
        } catch (error) {
            console.error('Error fetching discounted drones:', error);
            res.status(500).json({ message: 'Error fetching discounted drones' });
        }
    },

    getDiscountedDrones: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
    
            const { limit } = req.query;
            const limitClause = limit ? `LIMIT ${parseInt(limit)}` : '';
    
            const discountedDrones = await conn.query(`
                SELECT d.idDrone, d.name AS droneName, m.name AS manufacturerName, d.price, 
                       MIN(dI.imageUrl) AS imageUrl, ds.amount
                FROM drone d 
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                LEFT JOIN Drone_Image dI ON d.idDrone = dI.idDrone
                JOIN Drone_Discount dd ON d.idDrone = dd.idDrone
                JOIN Discount ds ON dd.idDiscount = ds.idDiscount
                WHERE dd.isActive = 1
                GROUP BY d.idDrone, droneName, manufacturerName, d.price, ds.amount
                ORDER BY ds.amount DESC ${limitClause}; 
            `);
    
            discountedDrones.forEach(drone => {
                drone.finalPrice = drone.price - (drone.price * drone.amount) / 100;
            });
    
            conn.release();
            res.json(discountedDrones);
        } catch (error) {
            console.error('Error fetching discounted drones:', error);
            res.status(500).json({ message: 'Error fetching discounted drones' });
        }
    }
    
    

}











