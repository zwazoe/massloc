import Moment from 'moment';

export const promise = (item) => {
	new Promise(resolve => {
		resolve(item)
	})
}

export const findAll = (collection, query) => {
	let output = [{}];
	if (collection && query) {
		output = collection.filter(item => {
			return query.relevant_keys.includes(item[query.searching_key])
		})
	}
	output = output ? output : []
	return output[0]
}
export const SectionMerged = (section_keys, Sections) => {
	let output = {}
	// console.log("from control", section_keys, Sections)

	if (section_keys && Sections) {
		section_keys.map(section_key => {
			let query = {
				relevant_keys: [section_key],
				searching_key: "_id"
			}
			let section = findAll(Sections, query)
			// console.log("from control sections find all ", section)
			if (section.field) {

				let entries = Object.entries(section.field);
				entries.map(entry => {
					let output_entry = output[entry[0]]
					if (output_entry) {
						entry[1].map(key => {
							if (!output_entry.includes(key)) {
								output_entry.push(key)
								output[entry[0]] = output_entry
							}
						})
					} else {
						output[entry[0]] = entry[1]
					}
				})
			}

		})
	}
	return output;
}
export const DateRangeControl = (keys, mw_items, DateRange, TimeRange) => {
	
	let full_day = mw_items.full_day
	let today_name = mw_items.today_name
	let output = false;
	keys.forEach(key => {
		let date_item = DateRange[key];
		if (date_item) {

			// current status will change output
			let current_status = true;
			let start_date = date_item.attributes_date_start;
			let end_date = date_item.attributes_date_end;
			console.log("date management", start_date, end_date + 1)
			let date_range_min = new Date(Moment(start_date).format(`YYYY-MM-DD`))
			let date_range_max = new Date(Moment(end_date).format(`YYYY-MM-DD`))
			current_status = date_range_min < full_day && full_day < date_range_max
			//  change current output only if it is false
			if (!output) {
				output = current_status
				console.log(output)
			}
			let ItemTimeRange = date_item.TimeRange;
			if (ItemTimeRange && output) {
				output = false;
				ItemTimeRange.forEach(time_range_key => {
					let day_status = true;
					let time_range = TimeRange[time_range_key]
					// check to change output to true
					if (time_range && !output) {
						// check and make sure today is a match
						if (time_range.days) {
							console.log(time_range.days, today_name)
							if (!time_range.days.includes(today_name)) {
								day_status = false;
							}
						}
						output = day_status
						if (output) {
							output = false;
							let time_status = true;
							let start_time = time_range.attributes_time_start;
							let end_time = time_range.attributes_time_end;
							let time_range_min = new Date(Moment().format(`YYYY-MM-DD[T${start_time}]`))
							let time_range_max = ''
							if (start_time > end_time) {
								time_range_max = new Date(Moment().add(1, 'days').format(`YYYY-MM-DD[T${time_range.attributes_time_end}]`))
							} else {
								time_range_max = new Date(Moment().format(`YYYY-MM-DD[T${end_time}]`));

							}
							console.log('start_time, end_time', time_range_min, time_range_max)
							time_status = time_range_min < full_day && full_day < time_range_max
							if (time_status) {
								output = true
							}
						}
					}
				});
			}

		} else {
			output = true;
			return promise(output)
		}
	})

	return promise(output)

}

export const DiscountControl = (keys, discount_codes, Discount) => {
	console.log("discount control arguments", discount_codes, keys, Discount)
	let output = false;
	if (discount_codes) {
		keys.forEach(key => {

			let discount_item = Discount[key];
			if (discount_codes.includes(discount_item.attributes_code)) {
				output = true;
			}
		})
	} else {
		output = true
	}
	return output;

}

export const AgeRangeControl = (keys, discount_codes, Discount) => {
	console.log("discount control arguments", discount_codes, keys, Discount)
	let output = false;
	if (discount_codes) {
		keys.forEach(key => {

			let discount_item = Discount[key];
			if (discount_codes.includes(discount_item.attributes_code)) {
				output = true;
			}
		})
	} else {
		output = true
	}
	return output;

}