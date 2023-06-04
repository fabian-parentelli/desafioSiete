import { Router } from 'express';
import Carts from '../dao/dbManager/carts.dbManager.js';

const router = Router();
const cartManager = new Carts();

router.post('/', async (req, resp) => {
    try {
        const result = await cartManager.save();
        resp.send({ status: 'Success', payload: result});

    } catch (error) {
        resp.status(500).send({ error: 'Error', error })
    };
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await cartManager.getById(pid);
        res.send({ status: 'Success', payload: result });
    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

router.post('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const result = await cartManager.addProductToCart(cid, pid);
        res.send({ status: 'Success', payload: result });
    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid } = req.params; 
    const { pid } = req.params; 
    try {
        const result = await cartManager.deleteProduct(cid, pid);
        res.send({ status: 'Succes', payload: result});
    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
    try {
        const result = await cartManager.updateProducts(cid, products);
        res.send({ status: 'Succes', payload: result});
    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const result = await cartManager.updateQuantity(cid, pid, quantity);
        res.send({ status: 'Succes', payload: result});    
    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartManager.deleteAllProducts(cid);     
        res.send({ status: 'Succes', payload: result});    
    } catch (error) {
        res.status(500).send({ error: 'Error', error });
    };
});

export default router;