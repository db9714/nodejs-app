const router = require("express").Router();
const AuthModel = require("../models/auth.model");
var paginatedData = require('./../middleware/pagination')
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const auth = require("./../middleware/auth");
var bodyParser = require('body-parser');


router.use(bodyParser.json()); // to use body object in requests
/**
 * @swagger
 *  tags:
 *    name: Users
 *    description: List of users
 */


/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/auths'
 */
router.route("/").get((req, res) => {
  res.send("Welcome to Node JS App")
})

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
 *     consumes:
 *        - application/json
 *     requestBody:
 *       required: true
 *     content:
 *          application/json:
 *     parameters: 
 *        - in: body
 *          schema:
 *              $ref: '#/components/schemas/auths'
 *              type: object
 *     responses:
 *       200:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auths'
 *       500:
 *         description: Some server error
 */
router.route("/").post((req, res) => {
    const { name, description,email,password } = req.body;
    console.log(req.body)
    AuthModel.find({ email: email }).then((res1) => {
        if (res1) {
            const newUser = AuthModel({ name, description,email,password })
            newUser.save()
                .then((user) => {
                    return res.status(200).json(user)
                })
                .catch((error) => {
                    console.log(error)
                    return res.status(500).json({ "Error": 'User Already Exist with this email' })
                })

        } else {
            return res.status(500).json("Error")
        }
    }).catch((err) => {
        return res.status(500).json({ "Error": err })
    })
})
/**
 * @swagger
 * /all:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/auths'
 */
router.route("/all").get(paginatedData(AuthModel), (req, res) => {
    AuthModel.find().then((res1) => {
        if (res1) {
            return res.status(200).json(res.paginatedData)

        } else {
            return res.status(500).json("Error")
        }
    }).catch((err) => {
        return res.status(500).json({ "Error": err })
    })
})

/**
 * @swagger
 * /user/:id:
 *   patch:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/auths'
 */
router.route("/user/:id").patch((req, res) => {
    const { name, description} = req.body;
    AuthModel.findByIdAndUpdate(req.params.id, { description: description,name:name }, { new: true }, function (err, result) {
        if (err) {
            return res.status(500).json({
                msg: 'Error',
                err
            })
        }
        return res.status(200).json(result)
    })

})
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Returns all users
 *     tags: [Users]
 *     consumes:
 *        - application/json
 *     "parameters": [
 *               {
 *                   "name": "id",
 *                   "in": "path",
 *                   "description": "The username of the user",
 *                   "required": true,
 *                   "type": "string"
 *               }
 *               ]
 *     responses:
 *       200:
 *         description: the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/auths'
 */
router.route("/user/:id").delete((req, res) => {
    console.log(req.params.id)
    AuthModel.findByIdAndDelete(req.params.id)
        .then((response) => {
            res.status(200).json('User Deleted');
        })
        .catch((err) => {
            res.status(500).json({ 'error': err })
        })

})

// Register
router.route("/register").post(async (req, res) => {
    try {
        // Get user input
        const { name, description, email, password } = req.body;

        // Validate user input
        if (!(email && password && name && description)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await AuthModel.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await AuthModel.create({
            name,
            description,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

// Login
router.route("/login").post(async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await AuthModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2y",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});

router.route("/welcome").get(auth, (req, res) => {
    AuthModel.find().then((res1) => {
        if (res1) {
            return res.status(200).json(res1)

        } else {
            return res.status(500).json("Error")
        }
    }).catch((err) => {
        return res.status(500).json({ "Error": err })
    })
})


module.exports = router;
