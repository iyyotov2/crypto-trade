const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2
    },
    image: {
        type: String,
        validate: {
            validator: function() {
                return this.image.startsWith('http://') || this.image.startsWith('https://');
            },
            message: 'Home Image is not valid!'
        },
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cryptoDescription: {
        type: String,
        required: true,
        minLength: 10
    },
    paymentMethod: {
        type: String,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
        required: true
    },
    buyACrypto: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;