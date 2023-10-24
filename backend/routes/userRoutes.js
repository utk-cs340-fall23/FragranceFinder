const router = require('express').Router();
const { User } = require('../models');
const { signToken, authMiddleware } = require('../utils/auth');


router.post('/', async (req, res) => {

    // Try to create user. Return token if successful
    try {
        const newUser = await User.create(req.body);

        res.json({
            token: signToken(newUser)
        });
    }
    catch (err) {
        if (err.original?.code == 'ER_DUP_ENTRY') {
            res.status(400).json({
                message: "An account already exists with that email!"
            });
            return;
        }
        console.log(err);
        res.status(500).json({
            message: "An error occurred. Please try again."
        });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    res.json(req.user);
})


router.post('/login', async (req, res) => {

    // Find user
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    if (!user) {
        res.status(404).json({
            message: 'No user with that email address!',
            type: 'is-danger'
        });
        return;
    }

    // If password is correct, create token and return to user
    const validPassword = user.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({
        message: 'Incorrect password!',
        type: 'is-danger'
      });
      return;
    }

    res.json({
        token: signToken(user)
    });
});


module.exports = router;