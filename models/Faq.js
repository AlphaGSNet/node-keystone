var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Faq Model
 * =============
 */

var Faq = new keystone.List('Faq');

Faq.add({
	name: { type: String, required: true },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
});

Faq.register();
