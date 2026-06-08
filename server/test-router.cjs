const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ router: true }));
const app = express();
app.use('/api/habilitaciones', router);
app.listen(3011, () => console.log('Router test on 3011'));
