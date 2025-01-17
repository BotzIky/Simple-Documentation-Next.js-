export default async function handler(req, res) {
  const { url } = req.query;
  if (url) {
    res.status(200).json({ success: true, message: 'Example success' });
  } else {
    res.status(500).json({ success: false, message: 'Example error' });
  }
}
