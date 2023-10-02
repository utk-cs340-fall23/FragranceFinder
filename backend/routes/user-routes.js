const router = require('express').Router();
const { User } = require('../models');
const { signToken, authMiddleware } = require('../utils/auth');


router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        res.json({
            token: signToken(newUser),
            user: newUser
        });
    }
    catch (err) {
        if (err.original.code == 'ER_DUP_ENTRY') {
            res.status(500).json({
                message: "An account already exists with that email!"
            });
            return;
        }
        res.status(500).json({
            message: "An error occurred. Please try again."
        });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    res.json(req.user);
})


router.post('/login', async (req, res) => {
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

    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({
        message: 'Incorrect password!',
        type: 'is-danger'
      });
      return;
    }

    res.json({
        token: signToken(user),
        user: user
    });
});


module.exports = router;