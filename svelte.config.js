import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
console.log(process.env.NODE_ENV);
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		prerender: {
			enabled: false
		},
		floc: true,
	
		adapter: adapter({
			// default options are shown
			out: 'build',

			env: { port: process.env.PORT }
		})
	}
};

export default config;
