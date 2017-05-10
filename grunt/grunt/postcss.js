'use strict';
module.exports = {
	options: {
		processors: [
			require('autoprefixer')({
				browsers: [
					'Android 2.3',
					'Android >= 4',
					'Chrome >= 20',
					'Firefox >= 24',
					'Explorer >= 9',
					'iOS >= 6',
					'Opera >= 12',
					'Safari >= 6'
				]
			}),
			require('postcss-sorting')({ 'sort-order': 'csscomb' })
		]
	},
	app: {
		src: '<%= less.app.dest %>'
	}
};
