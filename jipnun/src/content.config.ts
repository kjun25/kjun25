import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * 만화. 매주 하나씩 직접 올린다.
 *
 * 올리는 방법
 *  1. 그림을 public/webtoon/<회차이름>/ 아래에 넣는다 (1.png, 2.png ...)
 *  2. src/content/webtoon/<회차이름>.md 를 만들고 아래 항목을 채운다
 *  3. git push 하면 배포된다
 *
 * alt 는 비워 두면 안 된다. 눈으로 못 보는 사람이 읽는 글이고,
 * 검색엔진이 그림 속 글자를 읽지 못하기 때문에 검색으로 들어오는 길이기도 하다.
 */
const webtoon = defineCollection({
  loader: glob({ base: './src/content/webtoon', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** 회차 번호. 목록에서 정렬에 쓴다. */
    episode: z.number().int().positive(),
    date: z.coerce.date(),
    /** 검색 결과와 링크 미리보기에 그대로 나가는 한 문장 */
    summary: z.string(),
    /** 이 회차가 다루는 용어. 용어 페이지로 이어 준다. */
    terms: z.array(z.string()).default([]),
    panels: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().min(1, 'alt 를 반드시 적습니다'),
        })
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { webtoon }
