const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.classification = !isEmpty(data.classification) ? data.classification : 'Delayed';
  data.name = !isEmpty(data.name) ? data.name : 'John Doe';
  if (!data.symptoms || data.symptoms && !data.symptoms[0]) {
    errors.symptoms = "Please add a symptom for this patient."
  } else {

    data.symptoms && data.symptoms.map((symptom, index) => {
      if (Validator.isEmpty(symptom.diagnostic)) {
        errors.symptoms = [...errors.symptoms]
        errors.symptoms[index] = {
          diagnostic: "A diagnostic is required."
        }
      }
    })
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
