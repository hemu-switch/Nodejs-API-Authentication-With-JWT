const router = require('express').Router();
const verified = require('./verifyToken');

router.get('/', verified, async (req, res) => {
  //   res.json({
  //     posts: {
  //       title: 'My First Post',
  //       description: 'random data you shoundnt access withour login'
  //     }
  //   });
  res.send(req.user);
});

module.exports = router;
