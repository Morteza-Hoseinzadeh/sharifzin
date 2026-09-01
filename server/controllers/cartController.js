const db = require('../models/dbConnection');
const crypto = require('crypto'); // ← به‌جای uuid

// پیدا کردن یا ساختن سبد بر اساس cartToken
async function getOrCreateCart(cartToken) {
  if (!cartToken) {
    cartToken = crypto.randomUUID(); // ← اینجا
  }

  const [rows] = await db.query('SELECT * FROM carts WHERE token = ?', [cartToken]);

  if (rows.length) {
    return rows[0];
  }

  const [result] = await db.query('INSERT INTO carts (token) VALUES (?)', [cartToken]);

  return {
    id: result.insertId,
    token: cartToken,
  };
}

const CART_ITEM_SELECT = `
  SELECT
    ci.id, ci.quantity, ci.color, ci.price_at_add,
    p.id AS product_id, p.title, p.slug, p.thumbnail,
    p.price, p.final_price
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.cart_id = ?
`;

// GET /cart
exports.getCart = async (req, res) => {
  try {
    const cartToken = req.headers['x-cart-token'] || req.query.cartToken;

    const cart = await getOrCreateCart(cartToken);
    const [items] = await db.query(CART_ITEM_SELECT, [cart.id]);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price_at_add, 0);

    res.json({
      cartId: cart.id,
      cartToken: cart.token,
      items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در دریافت سبد خرید' });
  }
};

// POST /cart/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, color = null } = req.body;
    const cartToken = req.headers['x-cart-token'] || req.body.cartToken;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'productId و quantity معتبر الزامی است' });
    }

    const [productRows] = await db.query('SELECT id, final_price FROM products WHERE id = ?', [productId]);

    if (!productRows.length) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    const price = productRows[0].final_price;
    const cart = await getOrCreateCart(cartToken);

    const [existing] = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND color <=> ?', [cart.id, productId, color]);

    if (existing.length) {
      await db.query('UPDATE cart_items SET quantity = quantity + ?, price_at_add = ? WHERE id = ?', [quantity, price, existing[0].id]);
    } else {
      await db.query('INSERT INTO cart_items (cart_id, product_id, quantity, color, price_at_add) VALUES (?, ?, ?, ?, ?)', [cart.id, productId, quantity, color, price]);
    }

    const [items] = await db.query(CART_ITEM_SELECT, [cart.id]);

    res.status(200).json({
      cartId: cart.id,
      cartToken: cart.token,
      items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در افزودن به سبد' });
  }
};

// PATCH /cart/item/:itemId
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartToken = req.headers['x-cart-token'] || req.body.cartToken;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity معتبر الزامی است' });
    }

    const cart = await getOrCreateCart(cartToken);

    const [result] = await db.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?', [quantity, req.params.itemId, cart.id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'آیتم در سبد یافت نشد' });
    }

    const [items] = await db.query(CART_ITEM_SELECT, [cart.id]);
    res.json({ cartId: cart.id, cartToken: cart.token, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در به‌روزرسانی سبد' });
  }
};

// DELETE /cart/item/:itemId
exports.removeCartItem = async (req, res) => {
  try {
    const cartToken = req.headers['x-cart-token'] || req.body.cartToken;
    const cart = await getOrCreateCart(cartToken);

    const [result] = await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [req.params.itemId, cart.id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'آیتم در سبد یافت نشد' });
    }

    const [items] = await db.query(CART_ITEM_SELECT, [cart.id]);
    res.json({ cartId: cart.id, cartToken: cart.token, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در حذف آیتم' });
  }
};

// DELETE /cart/clear
exports.clearCart = async (req, res) => {
  try {
    const cartToken = req.headers['x-cart-token'] || req.body.cartToken;
    const cart = await getOrCreateCart(cartToken);

    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);

    res.json({ cartId: cart.id, cartToken: cart.token, items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در پاک کردن سبد' });
  }
};
