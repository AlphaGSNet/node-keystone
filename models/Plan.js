var keystone = require('keystone');

/**
 * Plan Model
 * ==================
 */

var Plan = new keystone.List('Plan', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Plan.add({
	name: { type: String, required: true },
});

Plan.relationship({ ref: 'Post', path: 'plans' });

Plan.register();
