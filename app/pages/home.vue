<script setup lang="ts">
useHead({ title: '' })
definePageMeta({
	alias: ['/'],
	title: '主页',
})
const appConfig = useAppConfig()
const { data: feed } = await useFetch('/api/feed/blog')
</script>

<template>
<ZhiluAvatar class="avatar" />

<div class="wrapper">
	<ZField>
		<template #label>
			<span style="font-size: 3rem;">👋</span>
		</template>
		<h1 style="font-size: 3rem;">
			你好，<br>我是<mark>{{ appConfig.author.name }}</mark>
		</h1>
		<p class="desc">
			{{ appConfig.subtitle }}
		</p>
		<div>
			<ZButton
				icon="ri:file-list-3-line"
				to="https://blog.cot.wiki/"
				text="博客"
				primary
			/>
			<ZButton
				icon="ri:github-line"
				to="https://github.com/cotovo"
				text="GitHub"
			/>
		</div>
	</ZField>

	<ZField label="介绍">
		<p>你好，我是 <strong>Perimsx</strong>，一名即将毕业的信息安全专业学生。</p>
		<p>这里主要记录我的网络安全学习心得，连接着我的博客、知识库与个人项目。</p>
	</ZField>

	<ZField label="近期活动">
		<p><strong>2026 年 7 月</strong> · 使用域名<ZLink to="https://coox.one/">coox.one</ZLink>，并全面使用<ZLink to="https://www.cloudflare.com/" icon="logos:cloudflare" text="" /></p>
		<p><strong>2026 年 4 月 - 至今</strong> · 在完成一件事。</p>
		<p><strong>2026 年 3 月</strong> · 使用 Nuxt 4 重构<ZLink to="https://cot.wiki/">个人主站</ZLink>。</p>
		<p><strong>2026 年 2 月</strong> · 使用 React 重构<ZLink to="https://blog.cot.wiki/">个人博客</ZLink>。</p>
	</ZField>

	<ZField label="关于主页">
		<p>
			本主页基于
			<ZLink to="https://github.com/L33Z22L11/homepage-v5" icon="ri:github-line">L33Z22L11/homepage-v5</ZLink>
			搭建，感谢原作者的开源贡献。
		</p>
		<p>
			博客开发也受到开源社区启发，特别感谢以下项目与作者：<br>
		</p>
		<p><ZBadge v-for="item in appConfig.fork" :key="item.link" v-bind="item" /></p>
	</ZField>
</div>
</template>

<style lang="scss" scoped>
.avatar {
	position: fixed;
	opacity: 0.2;
	right: 20vw;
	margin-right: -0.382em; // (1 - √5)/2
	mask-image: radial-gradient(#FFF 43.7%, transparent 70.7%); // (√5 - 1) / 2 x, x = √2 / 2
	font-size: min(100vw, 61.8vh);
	z-index: -1;
}

.desc {
	margin: 1rem 0;
	font-size: 1.5rem;
	color: var(--c-text-2);
}
</style>
