var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: 'lessonNumber'
});

Post.add({
	title: { type: String, required: true },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	description: { type: Types.Html, wysiwyg: true, height: 150 },
	content: { type: Types.Textarea },
	plans: { type: Types.Relationship, ref: 'Plan', many: true },
	healer: { type: Types.Relationship, ref: 'Healer' },
	segment: { type: Types.Number },
	lessonNumber: { type: Types.Number },
	duration: { type: Types.Number },
	healingMode: { type: Types.Text },
	tag: { type: Types.Select, options: 'Meditation, Exercise, Fireside Chat, Meditation/Exercise, Kid Friendly'},
	secondTag: { type: Types.Select, options: 'Kid Friendly'},
	downloads: {
		video: { type: Types.Textarea },
		audioOnly: { type: Types.Textarea },
		additionalMaterials: { type: Types.Textarea },
		transcript: { type: Types.Textarea },
		youtube: { type: Types.Textarea }
	},
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage }
});

Post.defaultColumns = 'title|40%, lessonNumber, healer, segment, tag, state';
Post.register();
