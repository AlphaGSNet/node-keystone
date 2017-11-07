var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Healer Model
 * =============
 */

var Healer = new keystone.List('Healer', {
	autokey: { from: 'name', path: 'key', unique: true },
	defaultSort: 'name'
});

Healer.add({
	name: { type: Types.Name, required: true },
	photo: { type: Types.CloudinaryImage, folder: '/images/healers/', publicID: 'slug' },
	title: { type: Types.Textarea, height: 150 },
	address: { type: Types.Textarea, height: 150 },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
});

Healer.relationship({ ref: 'Post', path: 'healer' });

Healer.register();
