export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  const cartValue = process.env[`CART_VALUE_${id}`];
  const seller_name = process.env[`SELLER_NAME_${id}`];
  const client_name = process.env[`CLIENT_NAME_${id}`];
  const product_name = process.env[`PRODUCT_NAME_${id}`];
  const url = process.env[`URL_${id}`];

  if (!cartValue || !seller_name || !client_name || !product_name) {
    return res.status(400).json({ message: 'Missing environment variables' });
  }

  res.status(200).json({
    cartValue,
    seller_name,
    client_name,
    product_name,
    url
  });
}
