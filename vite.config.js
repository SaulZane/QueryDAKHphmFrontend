import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['core-js', 'regenerator-runtime']
	},
	build: {
		target: ['es2015', 'chrome58', 'firefox57', 'safari11', 'edge16']
	}
});
