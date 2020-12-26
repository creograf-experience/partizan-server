const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },

  id: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  phoneNumbers: [
    {
      number: String,
      phoneExist: Boolean
    }
  ],

  latestRatingValue: {
    type: Number,
    default: 0
  },

  rating: {
    averageValue: {
      type: Number,
      default: 0
    },
    data: {
      1: {
        type: Number,
        default: 0
      },
      2: {
        type: Number,
        default: 0
      },
      3: {
        type: Number,
        default: 0
      },
      4: {
        type: Number,
        default: 0
      },
      5: {
        type: Number,
        default: 0
      }
    }
  },

  userExist: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

ContactSchema.methods.updateRating = function (ratingValue) {
  this.rating.data[ratingValue] += 1;
  this.rating.averageValue = calculateAverage(this.rating.data);
};

const calculateAverage = ratingData => {
  const keys = Object.keys(ratingData).slice(0, 5);
  let dividend = 0;
  let divisor = 0;

  for (const key of keys) {
    dividend += key * ratingData[key];
    divisor += ratingData[key];
  }

  return Number((dividend / divisor).toFixed(1));
};

const ContactModal = mongoose.model('Contact', ContactSchema);
module.exports = ContactModal;
