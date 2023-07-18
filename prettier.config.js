/** @type {import('prettier').Config} */
export default {
	useTabs: true,
	tabWidth: 2,
	overrides: [
		{
			files: ["**/*.json"],
			options: {
				useTabs: false,
			},
		},
	],
};
