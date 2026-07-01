import type { Nav } from '~/types/nav'
import { h } from 'vue'
import homepageConfig from '~~/homepage.config'

// 图标查询：https://yesicon.app/ph
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	...homepageConfig,

	footer: [
		h('span', { style: 'display:flex;align-items:center;justify-content:center;gap:4px' }, `© ${new Date().getFullYear()} Perimsx`),
		h('a', { href: 'https://beian.miit.gov.cn/', target: '_blank', rel: 'noopener nofollow', style: 'display:flex;align-items:center;justify-content:center;gap:4px' }, [
			h('svg', { viewBox: '0 0 1024 1024', style: 'width:14px;height:14px', xmlns: 'http://www.w3.org/2000/svg' }, [
				h('path', { d: 'M150.528 689.152v-39.424h347.136v39.424H150.528z m0-225.28v-39.424h347.136v39.424H150.528z m0-217.6v-39.424h527.36v39.424h-527.36z', fill: 'currentColor' }),
				h('path', { d: 'M155.648 211.968h517.12v29.184h-517.12v-29.184z m0 217.6h336.896v29.184H155.648v-29.184z m0 225.28h336.896v29.184H155.648v-29.184z', fill: 'currentColor' }),
				h('path', { d: 'M94.72 914.944c-45.568 0-82.432-36.864-82.432-82.432v-742.4c0-45.568 36.864-82.432 82.432-82.432h638.464c45.568 0 82.432 36.864 82.432 82.432v152.576H768V90.112c0-18.944-15.36-34.304-34.304-34.304H94.72c-18.944 0-34.304 15.36-34.304 34.304v742.912c0 18.944 15.36 34.304 34.304 34.304h488.448v47.616H94.72z', fill: 'currentColor' }),
				h('path', { d: 'M94.72 909.824c-42.496 0-77.312-34.816-77.312-77.312v-742.4c0-42.496 34.816-77.312 77.312-77.312h638.464c42.496 0 77.312 34.816 77.312 77.312v147.456H773.12V90.112c0-21.504-17.92-39.424-39.424-39.424H94.72c-21.504 0-39.424 17.92-39.424 39.424v742.912c0 21.504 17.92 39.424 39.424 39.424h483.328v37.376H94.72z', fill: 'currentColor' }),
				h('path', { d: 'M791.552 770.048c-125.44 0-227.328-101.888-227.328-227.328s101.888-227.328 227.328-227.328S1018.88 417.792 1018.88 542.72c0 125.44-101.888 227.328-227.328 227.328z m0-406.528c-98.816 0-179.2 80.384-179.2 179.2s80.384 179.2 179.2 179.2 179.2-80.384 179.2-179.2c0.512-98.816-80.384-179.2-179.2-179.2z', fill: 'currentColor' }),
				h('path', { d: 'M791.552 764.928c-122.368 0-222.208-99.84-222.208-222.208s99.84-222.208 222.208-222.208S1013.76 420.352 1013.76 542.72s-99.84 222.208-222.208 222.208z m0-406.528c-101.888 0-184.32 82.944-184.32 184.32 0 101.888 82.944 184.32 184.32 184.32 101.888 0 184.32-82.944 184.32-184.32 0.512-101.888-82.432-184.32-184.32-184.32z', fill: 'currentColor' }),
				h('path', { d: 'M790.016 646.656c-55.808 0-100.864-45.056-100.864-100.864 0-55.808 45.056-100.864 100.864-100.864s100.864 45.056 100.864 100.864c0 55.808-45.056 100.864-100.864 100.864z m0-162.304c-33.792 0-61.44 27.648-61.44 61.44s27.648 61.44 61.44 61.44 61.44-27.648 61.44-61.44-27.648-61.44-61.44-61.44z', fill: '#349AE8' }),
				h('path', { d: 'M790.016 641.536c-52.736 0-95.744-43.008-95.744-95.744s43.008-95.744 95.744-95.744 95.744 43.008 95.744 95.744-43.008 95.744-95.744 95.744z m0-162.304c-36.864 0-66.56 29.696-66.56 66.56s29.696 66.56 66.56 66.56 66.56-29.696 66.56-66.56-29.696-66.56-66.56-66.56z', fill: '#349AE8' }),
				h('path', { d: 'M636.928 703.488h47.616v185.856l104.96-71.168 104.96 71.168v-185.856h47.616v275.968l-152.576-103.424-152.576 103.424z', fill: 'currentColor' }),
				h('path', { d: 'M642.048 708.608h37.376v190.464l110.08-74.752 110.08 74.752v-190.464h37.376v261.12l-147.456-99.84-147.456 99.84z', fill: 'currentColor' }),
			]),
			homepageConfig.icp,
		]),
		],

	// 用于在主页展示下游引用
	fork: [
		{
			img: 'https://github.com/L33Z22L11.png',
			link: 'https://github.com/L33Z22L11/homepage-v5',
			text: 'homepage-v5',
		},
	],

	nav: [
		{
			title: '',
			items: [
				{ icon: 'ri:id-card-line', text: '简介', url: '/' },
				{ icon: 'ri:quill-pen-line', text: '文章', url: '/article' },
				{ icon: 'ri:code-line', text: '项目', url: '/project' },
				{ icon: 'ri:planet-line', text: '站点', url: '/site' },
				{ icon: 'ri:history-line', text: '日志', url: '/log' },
			],
		},
		{
			title: '社交',
			items: [
				{ icon: 'ri:mail-line', text: 'cotovo@163.com', url: 'mailto:cotovo@163.com' },
				{ icon: 'ri:github-line', text: 'GitHub', url: 'https://github.com/cotovo' },
				{ icon: 'ri:bilibili-line', text: 'Bilibili', url: 'https://space.bilibili.com/9655855' },
				{ icon: 'ri:tiktok-fill', text: 'Douyin', url: 'https://v.douyin.com/HWMgjLaTtFk' },
			],
		},
	] satisfies Nav,

	themes: {
		light: {
			icon: 'ri:sun-line',
			tip: '浅色模式',
		},
		system: {
			icon: 'ri:tv-2-line',
			tip: '跟随系统',
		},
		dark: {
			icon: 'ri:moon-line',
			tip: '深色模式',
		},
	},
})
