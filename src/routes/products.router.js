import { Router } from 'express';
import Products from '../dao/dbManager/products.dbManager.js';


const router = Router();
const productManager = new Products();

router.get('/', async (req, res) => {

    const { limit = 10, page = 1, query = false, sort } = req.query;

    if (sort) {
        if (sort !== 'desc' && sort !== 'asc') {
            return res.status(400).send({ status: 'error', error: 'This sort no exist' });
        };
    };

    try {
        const products = await productManager.getAll(limit, page, query, sort);

        if (page > products.totalPages || page <= 0) {
            return res.status(400).send({ status: 'error', error: 'This page no exist' });
        };

        const url = '/api/products?'
        products.prevLink = products.hasPrevPage ? `${url}page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `${url}page=${products.nextPage}` : null;

        res.send({ status: 'Success', payload: products });

    } catch (error) {
        res.status(500).send({ status: 'error', error });
    };
});

router.get('/:pid', async (req, res) => {

    const { pid } = req.params;

    try {
        const product = await productManager.getById(pid);
        if (product) { res.send({ status: 'Sucess', payload: product }) };

    } catch (error) {
        res.status(500).send({ status: 'Error', error });
    };
});

router.post('/', async (req, res) => {

    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ status: 'error', error: 'Incomplete Value' });
    };

    const codeSearch = await productManager.getByCode(code);
    if (codeSearch) {
        return res.status(400).send({ codeSearch });
    };

    try {
        const result = await productManager.save({
            title, description, code, price, stock, category
        });

        res.send({ status: 'Success', payload: result });

    } catch (error) {
        res.status(500).send({ status: 'error', error });
    };
});

router.put('/:pid', async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    const { pid } = req.params;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ status: 'error', error: 'Incomplete Value' });
    };

    try {
        const product = await productManager.updateById(pid, {
            title,
            description,
            code,
            price,
            stock,
            category
        });

        res.send({ status: 'Success', payload: product });

    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

router.delete('/:pid', async (req, res) => {

    const { pid } = req.params;

    try {
        const result = await productManager.deleteById(pid);
        res.send({ Status: 'Success', payload: result });

    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

export default router;