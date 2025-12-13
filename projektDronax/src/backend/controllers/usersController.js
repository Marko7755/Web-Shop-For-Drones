const getPool = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { username, password, repeatPassword, name, role } = req.body;

            if (password !== repeatPassword) return res.status(400).json({ message: 'Passwords do not match' });

            const hashedPassword = await bcrypt.hash(password, 10);

            const registerQuery = await conn.query(
                'INSERT INTO User (username, password, name, role) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, name, role]
            );

            if (registerQuery.affectedRows > 0) {
                res.status(200).json({ message: 'User registered successfully', clearCart: true });
            } else {
                return res.status(500).json({ message: 'Error registering user' });
            }

            conn.release();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding a User to DB' });
        }
    },

    login: async (req, res) => {
        try {
            const pool = await getPool();
            const conn = await pool.getConnection();

            const { username, password } = req.body;

            const users = await conn.query('SELECT * FROM User WHERE username = ?', [username]);

            if (users.length > 0) {
                const user = users[0];

                if (!(await bcrypt.compare(password, user.password))) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }

                const token = jwt.sign(
                    { userId: user.idUser, username: user.username, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({ token, role: user.role, clearCart: true });
            } else {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            conn.release();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error during login' });
        }
    },

    authenticateToken: (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access Denied' });

        jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid Token' });
            req.user = user;
            next();
        });
    }
};
