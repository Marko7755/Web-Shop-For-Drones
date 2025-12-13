const getPool = require('../database/database');

module.exports = {
    itemAdd: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idUser, idDrone, quantity } = req.body;
            const query = await conn.query(
                'INSERT INTO Shopping_Cart (idUser, idDrone, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
                [idUser, idDrone, quantity, quantity]
            );

            conn.release();

            if (query.affectedRows > 0) {
                res.status(200).json({ message: 'Item successfully added to cart' });
            } else {
                res.status(500).json({ message: 'Error adding item to cart' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding item to shopping cart' });
        }
    },

    getCartItems: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
            const { userId } = req.params;
    
            const query = await conn.query(
                `SELECT sc.idUser, sc.idDrone, sc.quantity, 
                        d.name, d.about, d.manufacturingDate, d.price AS originalPrice,
                        (SELECT di.amount FROM Drone_Discount dd
                         JOIN Discount di ON dd.idDiscount = di.idDiscount
                         WHERE dd.idDrone = d.idDrone AND dd.isActive = 1
                         ORDER BY di.startDate DESC LIMIT 1) AS discountAmount,
                        MIN(droneImg.imageUrl) AS imageUrl
                 FROM Shopping_Cart sc
                 JOIN Drone d ON sc.idDrone = d.idDrone
                 LEFT JOIN Drone_Image droneImg ON d.idDrone = droneImg.idDrone
                 WHERE sc.idUser = ? 
                 GROUP BY sc.idUser, sc.idDrone, sc.quantity, d.name, d.about, d.manufacturingDate, d.price`,
                [userId]
            );

            query.forEach(item => {
                const discountAmount = item.discountAmount ? (item.originalPrice * item.discountAmount) / 100 : 0;
                item.price = Math.max(item.originalPrice - discountAmount, 0); 
            });

            conn.release();
            res.status(200).json(query);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching shopping cart items' });
        }
    },

    removeItem: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();
            const { userId, idDrone } = req.params;

            const query = await conn.query(
                'DELETE FROM Shopping_Cart WHERE idUser = ? AND idDrone = ?',
                [userId, idDrone]
            );

            conn.release();

            if (query.affectedRows > 0) {
                res.status(200).json({ message: 'Item removed from cart' });
            } else {
                res.status(400).json({ message: 'Item not found in cart' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error removing item from cart' });
        }
    }
};
