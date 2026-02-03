import type { ComponentType } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Youtube,
  Instagram,
} from 'lucide-react'

export const runtime = 'nodejs'

type LinkItem = {
  id: string
  href: string
  icon: string
  title: string
}

type ProfileData = {
  avatarUrl: string
  name: string
  bio: string
  links: LinkItem[]
}

type Theme = 'dark' | 'aurora'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

const themeConfig: Record<
  Theme,
  {
    name: string
    background: string
    foreground: string
    mutedForeground: string
    border: string
    primary: string
    gradientOrbs: {
      top: string
      bottom: string
    }
  }
> = {
  dark: {
    name: '深色模式',
    background: 'bg-zinc-900',
    foreground: 'text-zinc-50',
    mutedForeground: 'text-zinc-400',
    border: 'border-zinc-700',
    primary: 'bg-blue-500',
    gradientOrbs: {
      top: 'bg-blue-500/20',
      bottom: 'bg-purple-500/10',
    },
  },
  aurora: {
    name: '极光模式',
    background: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950',
    foreground: 'text-white',
    mutedForeground: 'text-purple-200',
    border: 'border-purple-500/30',
    primary: 'bg-gradient-to-r from-pink-500 to-violet-500',
    gradientOrbs: {
      top: 'bg-pink-500/30',
      bottom: 'bg-cyan-500/20',
    },
  },
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Youtube,
  Instagram,
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeTheme(value: unknown): Theme {
  return value === 'aurora' ? 'aurora' : 'dark'
}

function normalizeProfileData(value: unknown): ProfileData | null {
  if (!isObject(value)) return null
  const avatarUrl = typeof value.avatarUrl === 'string' ? value.avatarUrl : null
  const name = typeof value.name === 'string' ? value.name : null
  const bio = typeof value.bio === 'string' ? value.bio : null
  const linksRaw = Array.isArray(value.links) ? value.links : null
  if (!avatarUrl || !name || bio === null || !linksRaw) return null

  const links: LinkItem[] = linksRaw
    .map((l) => {
      if (!isObject(l)) return null
      const id = typeof l.id === 'string' ? l.id : null
      const href = typeof l.href === 'string' ? l.href : ''
      const icon = typeof l.icon === 'string' ? l.icon : 'Globe'
      const title = typeof l.title === 'string' ? l.title : ''
      if (!id) return null
      return { id, href, icon, title }
    })
    .filter((x): x is LinkItem => Boolean(x))

  return { avatarUrl, name, bio, links }
}

async function readDb(): Promise<Array<{ uniqueId: string; data: unknown }>> {
  try {
    const content = await fs.readFile(DB_PATH, 'utf-8')
    const parsed = JSON.parse(content) as unknown
    return Array.isArray(parsed) ? (parsed as Array<{ uniqueId: string; data: unknown }>) : []
  } catch (err) {
    const nodeErr = err as NodeJS.ErrnoException
    if (nodeErr?.code === 'ENOENT') return []
    // JSON 解析失败 / 其他 IO 失败：返回空数组，让页面走 notFound 或展示错误
    return []
  }
}

function ProfileHeader({
  avatarUrl,
  name,
  bio,
  theme,
}: {
  avatarUrl: string
  name: string
  bio: string
  theme: Theme
}) {
  const themeStyle = themeConfig[theme]
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div
        className={`relative w-24 h-24 rounded-full overflow-hidden ring-4 ${themeStyle.background} shadow-lg`}
      >
        <Image
          src={avatarUrl}
          alt={name}
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="space-y-2">
        <h1 className={`text-2xl font-bold ${themeStyle.foreground}`}>{name}</h1>
        <p className={`text-sm ${themeStyle.mutedForeground} max-w-sm`}>{bio}</p>
      </div>
    </div>
  )
}

function LinkCard({
  href,
  icon: Icon,
  title,
  theme,
}: {
  href: string
  icon: ComponentType<{ className?: string }>
  title: string
  theme: Theme
}) {
  const themeStyle = themeConfig[theme]
  const isAurora = theme === 'aurora'
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center gap-3 w-full p-4 ${
        isAurora
          ? 'bg-white/10 backdrop-blur-sm border-purple-400/30 hover:bg-white/15 hover:border-purple-400/50'
          : 'bg-zinc-800/80 backdrop-blur-sm border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600'
      } rounded-lg transition-all duration-200 shadow-sm hover:shadow-md`}
    >
      <Icon className={`w-5 h-5 ${themeStyle.foreground} flex-shrink-0`} />
      <span className={`font-medium ${themeStyle.foreground}`}>{title}</span>
    </a>
  )
}

function Preview({ data, theme }: { data: ProfileData; theme: Theme }) {
  const themeStyle = themeConfig[theme]
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center px-4 py-12 ${themeStyle.background} transition-colors duration-300 min-h-svh`}
    >
      <div className="w-full max-w-md space-y-8">
        <ProfileHeader
          avatarUrl={data.avatarUrl}
          name={data.name}
          bio={data.bio}
          theme={theme}
        />

        <nav className="space-y-3">
          {data.links.map((link) => {
            const Icon = iconMap[link.icon] || Globe
            return (
              <LinkCard
                key={link.id}
                href={link.href}
                icon={Icon}
                title={link.title}
                theme={theme}
              />
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default async function UserPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params?.id
  if (!id) notFound()

  const db = await readDb()
  const record = db.find((r) => r?.uniqueId === id)
  if (!record) notFound()

  // 兼容两种保存结构：
  // 1) data = { profileData, theme }（当前前端保存就是这种）
  // 2) data = ProfileData（如果未来直接存 profile）
  let theme: Theme = 'dark'
  let profileData: ProfileData | null = null

  if (isObject(record.data) && 'profileData' in record.data) {
    const d = record.data as Record<string, unknown>
    theme = normalizeTheme(d.theme)
    profileData = normalizeProfileData(d.profileData)
  } else {
    profileData = normalizeProfileData(record.data)
  }

  if (!profileData) notFound()

  const themeStyle = themeConfig[theme]

  return (
    <main className="min-h-svh flex flex-col">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute top-1/4 -left-20 w-72 h-72 ${themeStyle.gradientOrbs.top} rounded-full blur-3xl transition-all duration-500`}
        />
        <div
          className={`absolute bottom-1/4 -right-20 w-80 h-80 ${themeStyle.gradientOrbs.bottom} rounded-full blur-3xl transition-all duration-500`}
        />
      </div>

      <Preview data={profileData} theme={theme} />

      <footer className={`py-6 text-center border-t ${themeStyle.border}`}>
        <p className={`text-xs ${themeStyle.mutedForeground}`}>
          © 2026 {profileData.name}. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
