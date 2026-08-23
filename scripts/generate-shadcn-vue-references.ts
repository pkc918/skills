/**
 * Generates skills/developer/shadcn-vue/references/*.md from:
 * - shadcn-vue: https://github.com/unovue/shadcn-vue (apps/v4/content/docs/components)
 * - Reka UI: https://reka-ui.com/docs/components/<slug>.md (API Reference section only)
 *
 * Run: pnpm gen:shadcn-vue
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'skills/developer/shadcn-vue/references')
const SHADCN_RAW = 'https://raw.githubusercontent.com/unovue/shadcn-vue/dev/apps/v4/content/docs/components'
const REKA_MD = 'https://reka-ui.com/docs/components'
const GITHUB_API = 'https://api.github.com/repos/unovue/shadcn-vue/contents/apps/v4/content/docs/components?ref=dev'
const CONCURRENCY = 8

interface Frontmatter {
  title?: string
  description: string
  rekaDoc?: string
  rekaApi?: string
}

interface Result {
  slug: string
  ok: boolean
  out?: string
  error?: string
}

function toPascalSlug(slug: string): string {
  return slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

function parseFrontmatter(raw: string): { fm: Frontmatter, body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m)
    return { fm: { description: '' }, body: raw }

  const fmText = m[1]
  const body = raw.slice(m[0].length)
  const fm: Frontmatter = { description: '' }

  const titleM = fmText.match(/^title:\s*(.+)$/m)
  if (titleM)
    fm.title = titleM[1].trim()

  const descBlock = fmText.match(/^description:\s*>-\s*\n((?:  .+\r?\n)+)/m)
  if (descBlock) {
    fm.description = descBlock[1]
      .split(/\r?\n/)
      .map(l => l.replace(/^  /, ''))
      .join('\n')
      .trim()
  }
  else {
    const descLine = fmText.match(/^description:\s*(.+)$/m)
    if (descLine)
      fm.description = descLine[1].trim()
  }

  const docM = fmText.match(/^\s*doc:\s*(\S+)/m)
  const apiM = fmText.match(/^\s*api:\s*(\S+)/m)
  if (docM)
    fm.rekaDoc = docM[1]
  if (apiM)
    fm.rekaApi = apiM[1]

  return { fm, body }
}

function getSection(body: string, heading: string): string {
  const re = new RegExp(
    `^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\r?\\n([\\s\\S]*?)(?=^## \\S|\\z)`,
    'm',
  )
  const m = body.match(re)
  return m ? m[1] : ''
}

function extractFirstVue(text: string): string | null {
  if (!text)
    return null
  const m = text.match(/```vue[^\n]*\r?\n([\s\S]*?)```/)
  return m ? m[1].trim() : null
}

function extractInstallSlug(installSection: string, filenameSlug: string): string {
  const bash = installSection.match(/```bash\r?\n([\s\S]*?)```/)
  if (!bash)
    return filenameSlug
  const add = bash[1].match(/add\s+(\S+)/)
  return add ? add[1].replace(/['"]/g, '') : filenameSlug
}

function buildInstallationBlock(slug: string): string {
  return [
    '```bash',
    `pnpm dlx shadcn-vue@latest add ${slug}`,
    `# or: npx shadcn-vue@latest add ${slug}`,
    `# or: yarn dlx shadcn-vue@latest add ${slug}`,
    `# or: bunx --bun shadcn-vue@latest add ${slug}`,
    '```',
    '',
  ].join('\n')
}

function extractUsageVue(body: string, slug: string): string | null {
  let vue = extractFirstVue(getSection(body, 'Usage'))
  if (vue)
    return vue
  if (slug === 'data-table')
    vue = extractFirstVue(getSection(body, 'Basic Table'))
  if (vue)
    return vue
  const afterInstall = body.includes('## Installation')
    ? body.split('## Installation').slice(1).join('## Installation')
    : body
  vue = extractFirstVue(afterInstall)
  if (vue)
    return vue
  return extractFirstVue(body)
}

function extractRekaSlug(fm: Frontmatter, filenameSlug: string): string {
  const u = fm.rekaDoc || fm.rekaApi || ''
  const m = u.match(/\/components\/([^/#?]+)/)
  return m ? m[1] : filenameSlug
}

function extractRekaApiSection(rekaMd: string): string {
  const start = rekaMd.match(/^## API Reference\s*\r?\n/m)
  if (!start || start.index === undefined)
    return ''
  const rest = rekaMd.slice(start.index + start[0].length)
  const next = rest.search(/^## /m)
  const api = next === -1 ? rest : rest.slice(0, next)
  return api.trim()
}

function normalizeRekaApi(markdown: string): string {
  let s = markdown
  s = s.replace(/^Props\r?\n/gm, '**Props**\n\n')
  s = s.replace(/^Events\r?\n/gm, '**Events**\n\n')
  s = s.replace(/^Slots\r?\n/gm, '**Slots**\n\n')
  return s
}

async function fetchText(url: string): Promise<string | null> {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'skills-generate-shadcn-vue-references' },
  })
  if (!r.ok)
    return null
  return r.text()
}

async function listComponentFiles(): Promise<string[]> {
  const r = await fetch(GITHUB_API, {
    headers: { 'User-Agent': 'skills-generate-shadcn-vue-references' },
  })
  if (!r.ok)
    throw new Error(`GitHub API ${r.status}`)
  const list: { name?: string }[] = await r.json()
  return list
    .filter(x => x.name?.endsWith('.md'))
    .map(x => x.name!.replace(/\.md$/, ''))
    .sort()
}

async function generateForSlug(slug: string): Promise<Result> {
  const rawUrl = `${SHADCN_RAW}/${slug}.md`
  const raw = await fetchText(rawUrl)
  if (!raw)
    return { slug, ok: false, error: 'missing shadcn source' }

  const { fm, body } = parseFrontmatter(raw)
  const title = fm.title || toPascalSlug(slug)
  const description = fm.description || ''

  const installSection = getSection(body, 'Installation')
  const installSlug = extractInstallSlug(installSection, slug)
  const installation = buildInstallationBlock(installSlug)

  let usageVue = extractUsageVue(body, slug)
  if (!usageVue) {
    usageVue = `<script setup lang="ts">\n</script>\n\n<template>\n  <!-- No Usage code block in upstream ${slug}.md -->\n</template>`
  }
  const usage = ['## Usage', '', '```vue', usageVue, '```', ''].join('\n')

  const rekaSlug = extractRekaSlug(fm, slug)
  let rekaApi = ''
  let hasReka = false
  const rekaMd = await fetchText(`${REKA_MD}/${rekaSlug}.md`)
  if (rekaMd) {
    const api = extractRekaApiSection(rekaMd)
    if (api) {
      hasReka = true
      rekaApi = ['## Reka UI API reference', '', normalizeRekaApi(api), ''].join('\n')
    }
  }

  const shadcnVueUrl = `https://shadcn-vue.com/docs/components/${slug}`
  const titleSuffix = hasReka ? ' (shadcn-vue + Reka UI)' : ' (shadcn-vue)'

  const links = [`  shadcn-vue: ${shadcnVueUrl}`]
  if (hasReka) {
    links.push(`  reka-doc: ${fm.rekaDoc || `https://reka-ui.com/docs/components/${rekaSlug}`}`)
    links.push(`  reka-api: ${fm.rekaApi || `https://reka-ui.com/docs/components/${rekaSlug}#api-reference`}`)
  }

  const descLines = description
    ? description.split('\n').join('\n  ')
    : ''
  const frontmatter = [
    '---',
    `title: ${title}${titleSuffix}`,
    description
      ? ['description: >-', `  ${descLines}`].join('\n')
      : 'description: ""',
    'component: true',
    'links:',
    ...links,
    '---',
    '',
  ].join('\n')

  const parts = [frontmatter, '## Installation', '', installation, usage]
  if (hasReka)
    parts.push(rekaApi)

  const outName = `${toPascalSlug(slug)}.md`
  const outPath = join(OUT_DIR, outName)
  await writeFile(outPath, parts.join('\n'), 'utf8')
  return { slug, ok: true, out: outPath }
}

async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = []
  let idx = 0

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++
      results[i] = await tasks[i]()
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()))
  return results
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const slugs = await listComponentFiles()

  const tasks = slugs.map(slug => async () => {
    try {
      return await generateForSlug(slug)
    }
    catch (e) {
      return { slug, ok: false, error: String(e) } as Result
    }
  })

  const results = await runWithConcurrency(tasks, CONCURRENCY)

  const bad = results.filter(r => !r.ok)
  if (bad.length)
    console.error('Failures:', bad)
  console.log(`Wrote ${results.filter(r => r.ok).length} files to ${OUT_DIR}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
