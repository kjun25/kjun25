// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

// 지금은 전부 정적 생성이다. 검색엔진이 완성된 HTML을 받아야 이 사이트가 성립한다.
// 단지 페이지 수만 개를 붙일 때 Cloudflare 어댑터로 서버 렌더링을 섞는다.
// (무료 플랜은 정적 자산 20,000개가 상한이라 단지 페이지는 정적으로 구울 수 없다.)
export default defineConfig({
  site: 'https://jipnun.com',
  integrations: [react(), sitemap()],
  output: 'static',
  build: { format: 'directory' },
  trailingSlash: 'ignore',
})
