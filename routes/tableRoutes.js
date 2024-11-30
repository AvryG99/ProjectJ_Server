const express = require('express');
const { getTableData } = require('../controllers/tableController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

/**
 * @swagger
 * /node/tables/{table_name}:
 *   get:
 *     summary: Get all rows from a specific table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: table_name
 *         required: true
 *         description: The name of the table to fetch data from.
 *         schema:
 *           type: string
 *           example: users
 *     responses:
 *       200:
 *         description: Successfully fetched data from the specified table.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 table:
 *                   type: string
 *                   example: users
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid table name or error querying the database.
 *       500:
 *         description: Internal server error.
 */
router.get('/:table_name', (req, res, next) => {
    next();
}, getTableData);
module.exports = router;
