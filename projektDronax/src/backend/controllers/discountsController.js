const getPool = require('../database/database');


module.exports = {
    discountAdd: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { amount, startDate, endDate } = req.body;
            await conn.query('INSERT INTO Discount(amount, startDate, endDate) VALUES (?, ?, ?)', [amount, startDate, endDate]);

            conn.release();
            res.json({ message: 'Discount added successfully to DB!' });
        }
        catch (error) {
            console.error('Error adding a Discount', error);
            res.status(400).json({ message: 'Error adding a Discount to DB', error });
        }
    },

    discountEdit: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { amount, startDate, endDate, idDiscount } = req.body;
            await conn.query('UPDATE discount SET amount = ?, startDate = ?, endDate = ? WHERE idDiscount = ?;',
                [amount, startDate, endDate, idDiscount]);

            conn.release();
            res.json({ message: 'Discount edited successfully!' });
        }
        catch (error) {
            console.error('Error editing a Discount', error);
            res.status(400).json({ message: 'Error editing a Discount', error });
        }
    },

    getDiscount: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idDiscount } = req.params;
            const discount = await conn.query("SELECT * FROM discount WHERE idDiscount = ?;",
                [idDiscount]);

            conn.release();
            if (discount.length > 0) {
                res.status(200).json(discount[0]);
            }
            else {
                res.status(404).json({ message: 'No Discount in DB found with that ID' });
            }

        }
        catch (error) {
            console.error('Error getting specific Discount from DB', error);
            res.status(500).json({ message: 'Error getting specific Discount from DB' });
        }
    },

    deleteDiscount: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { idToDelete } = req.params;

            const resRows = await conn.query('DELETE FROM discount WHERE idDiscount = ?;', [idToDelete]);

            if (resRows.affectedRows) {
                res.status(200).json({ message: `Discount with ID ${idToDelete} successfully deleted!` });
            }
            else {
                res.status(404).json({ message: `No Discount with ID ${idToDelete} found in DB` });
            }

            conn.release();
        }
        catch (error) {
            console.error('Error deleting Discount', error);
            res.status(400).json({ message: 'Error deleting Discount' });
        }
    },

    getDiscounts: async(req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const discounts = await conn.query('SELECT * FROM discount');
            conn.release();
            res.json(discounts);
        }
        catch (error) {
            console.error('Error getting Discount from DB', error);
            res.status(400).json({ message: 'Error getting Discount from DB' });
        }
    },

     applyDiscountToDrone : async (req, res) => {
        try {
          const pool = await getPool();
          const conn = await pool.getConnection();
      
          const { idDrone, idDiscount } = req.body;
      
          // Dohvati popust iz baze
          const [discount] = await conn.query('SELECT startDate, endDate FROM Discount WHERE idDiscount = ?', [idDiscount]);
      
          if (!discount) {
            conn.release();
            return res.status(404).json({ message: 'Discount not found' });
          }
      
          const today = new Date();
          const isActive = new Date(discount.startDate) <= today && today <= new Date(discount.endDate);
      
          // Unesi popust u Drone_Discount
          await conn.query('INSERT INTO Drone_Discount (idDrone, idDiscount, lastDiscountDate, isActive) VALUES (?, ?, ?, ?)', 
            [idDrone, idDiscount, discount.endDate, isActive]);
      
          conn.release();
          res.json({ message: 'Discount successfully applied to the drone!' });
        } catch (error) {
          console.error('Error applying discount:', error);
          res.status(500).json({ message: 'Error applying discount' });
        }
      }
      


}
