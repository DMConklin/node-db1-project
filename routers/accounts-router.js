const express = require('express')
const router = express.Router()
const db = require('../data/dbConfig')

router.get('/', async (req,res,next) => {
    try {
        const message = await db.select("*").from("accounts")
        res.json(message)
    } catch(err) {
        next(err)
    }
})

router.get('/:id', validateId(), async (req,res,next) => {
    try {
        res.json(req.account)
    } catch(err) {
        next(err)
    }
})

router.post('/', validateBody(), async (req,res,next) => {
    try {
        const messageID = await db.insert(req.body).into("accounts")
        const message = await db.select("*").from("accounts").where("id", messageID)
        res.json(message)
    } catch(err) {
        next(err)
    }
})

router.put('/:id', validateId(), validateBody(), async (req,res,next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        }
        await db("accounts").update(payload).where("id", req.params.id)
        const message = await db.first("*").from("accounts").where("id", req.params.id)
        res.json(message)
    } catch(err) {
        next(err)
    }
})

router.delete("/:id", validateId(), async (req,res,next) => {
    try {
        const success = await db("accounts").where("id", req.params.id).del()
        if (!success) {
            res.json({
                message: "Could not delete the following account",
                ...req.account
            })
        } else if (success) {
            res.json({
                message: "The following account was deleted",
                ...req.account
            })
        }
    } catch(err) {
        next(err)
    }
})

function validateId() {
    return async (req,res,next) => {
        try {
            const account = await db.select("*").from("accounts").where("id", req.params.id)
            if (account.length < 1) { 
                return res.status(404).json({
                    message: "The account does not exist"
                })
            }
            [req.account] = account
            next()
        } catch(err) {
            next(err)
        }
    }
}

function validateBody() {
    return (req,res,next) => {
        if (!req.body.name || !req.body.budget) {
            res.status(400).json({
                message: "Name and Budget required"
            })
        }
        next()
    }
}



module.exports = router