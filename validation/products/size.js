const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateSizeInput(data) {
	let errors = {};

	data.name = !isEmpty(data.names) ? data.names : '';
	if (Validator.isEmpty(data.names)) {
		errors.name = 'At least 1 name is required';
	}

	data.attribute_measurement = !isEmpty(data.attribute_measurement) ? data.attribute_measurement : '';
	if (Validator.isEmpty(data.attribute_measurement)) {
		errors.attribute_measurement = 'At least 1 measurement type is required';
	}

	data.attribute_field = !isEmpty(data.attribute_field) ? data.attribute_field : '';
	if (Validator.isEmpty(data.attribute_field)) {
		errors.attribute_field = 'At least 1 attribute field is required';
	}

	data.attribute_value = !isEmpty(data.attribute_value) ? data.attribute_value : '';
	if (Validator.isEmpty(data.attribute_value)) {
		errors.attribute_value = 'At least 1 attribute value is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
