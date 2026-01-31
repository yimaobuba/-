"use client"

import { useState } from "react"
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Youtube,
  Instagram,
  Edit,
  X,
  Plus,
  Trash2,
} from "lucide-react"
import Image from "next/image"

// 定义数据结构类型
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

// 主题类型
type Theme = "dark" | "aurora"

// 主题配置
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
    name: "深色模式",
    background: "bg-zinc-900",
    foreground: "text-zinc-50",
    mutedForeground: "text-zinc-400",
    border: "border-zinc-700",
    primary: "bg-blue-500",
    gradientOrbs: {
      top: "bg-blue-500/20",
      bottom: "bg-purple-500/10",
    },
  },
  aurora: {
    name: "极光模式",
    background: "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950",
    foreground: "text-white",
    mutedForeground: "text-purple-200",
    border: "border-purple-500/30",
    primary: "bg-gradient-to-r from-pink-500 to-violet-500",
    gradientOrbs: {
      top: "bg-pink-500/30",
      bottom: "bg-cyan-500/20",
    },
  },
}

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Youtube,
  Instagram,
}

// ProfileHeader 组件
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
        <h1 className={`text-2xl font-bold ${themeStyle.foreground}`}>
          {name}
        </h1>
        <p className={`text-sm ${themeStyle.mutedForeground} max-w-sm`}>
          {bio}
        </p>
      </div>
    </div>
  )
}

// LinkCard 组件
function LinkCard({
  href,
  icon: Icon,
  title,
  theme,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  theme: Theme
}) {
  const themeStyle = themeConfig[theme]
  const isAurora = theme === "aurora"
  return (
    <a
      href={href}
      className={`flex items-center gap-3 w-full p-4 ${
        isAurora
          ? "bg-white/10 backdrop-blur-sm border-purple-400/30 hover:bg-white/15 hover:border-purple-400/50"
          : "bg-zinc-800/80 backdrop-blur-sm border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600"
      } rounded-lg transition-all duration-200 shadow-sm hover:shadow-md`}
    >
      <Icon className={`w-5 h-5 ${themeStyle.foreground} flex-shrink-0`} />
      <span className={`font-medium ${themeStyle.foreground}`}>{title}</span>
    </a>
  )
}

// 预览组件
function Preview({ data, theme }: { data: ProfileData; theme: Theme }) {
  const themeStyle = themeConfig[theme]
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center px-4 py-12 ${themeStyle.background} transition-colors duration-300`}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Profile Section */}
        <ProfileHeader
          avatarUrl={data.avatarUrl}
          name={data.name}
          bio={data.bio}
          theme={theme}
        />

        {/* Links Section */}
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

// 编辑器表单组件
function EditorForm({
  data,
  onChange,
  theme,
  onThemeChange,
}: {
  data: ProfileData
  onChange: (data: ProfileData) => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
}) {
  const updateField = (field: keyof ProfileData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      href: "",
      icon: "Globe",
      title: "",
    }
    onChange({ ...data, links: [...data.links, newLink] })
  }

  const removeLink = (id: string) => {
    onChange({ ...data, links: data.links.filter((link) => link.id !== id) })
  }

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    onChange({
      ...data,
      links: data.links.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    })
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">编辑资料</h2>

      {/* 主题选择器 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">主题选择</label>
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as Theme)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="dark">深色模式 (Dark Mode)</option>
          <option value="aurora">极光模式 (Aurora)</option>
        </select>
      </div>

      {/* 头像URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">头像URL</label>
        <input
          type="text"
          value={data.avatarUrl}
          onChange={(e) => updateField("avatarUrl", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      {/* 名字 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">名字</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="你的名字"
        />
      </div>

      {/* 简介 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">简介</label>
        <textarea
          value={data.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
          placeholder="介绍一下自己..."
        />
      </div>

      {/* 链接列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">链接</label>
          <button
            onClick={addLink}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加链接
          </button>
        </div>

        <div className="space-y-3">
          {data.links.map((link) => (
            <div
              key={link.id}
              className="p-4 border border-border rounded-lg space-y-3 bg-background/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  链接 #{data.links.indexOf(link) + 1}
                </span>
                <button
                  onClick={() => removeLink(link.id)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">标题</label>
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(link.id, "title", e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="链接标题"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">URL</label>
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateLink(link.id, "href", e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">图标</label>
                  <select
                    value={link.icon}
                    onChange={(e) => updateLink(link.id, "icon", e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    {Object.keys(iconMap).map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LinkInBioPage() {
  // 初始数据
  const [profileData, setProfileData] = useState<ProfileData>({
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    name: "Alex Chen",
    bio: "Designer & Developer crafting digital experiences. Building the future, one pixel at a time.",
    links: [
      {
        id: "1",
        href: "https://github.com",
        icon: "Github",
        title: "GitHub",
      },
      {
        id: "2",
        href: "https://twitter.com",
        icon: "Twitter",
        title: "Twitter / X",
      },
      {
        id: "3",
        href: "https://linkedin.com",
        icon: "Linkedin",
        title: "LinkedIn",
      },
      {
        id: "4",
        href: "https://youtube.com",
        icon: "Youtube",
        title: "YouTube",
      },
      {
        id: "5",
        href: "https://instagram.com",
        icon: "Instagram",
        title: "Instagram",
      },
      {
        id: "6",
        href: "https://example.com",
        icon: "Globe",
        title: "Personal Website",
      },
      {
        id: "7",
        href: "mailto:hello@example.com",
        icon: "Mail",
        title: "Email Me",
      },
    ],
  })

  const [isEditing, setIsEditing] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")
  const themeStyle = themeConfig[theme]

  return (
    <main className="min-h-svh flex flex-col">
      {/* Background gradient orbs - 根据主题动态变化 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute top-1/4 -left-20 w-72 h-72 ${themeStyle.gradientOrbs.top} rounded-full blur-3xl transition-all duration-500`}
        />
        <div
          className={`absolute bottom-1/4 -right-20 w-80 h-80 ${themeStyle.gradientOrbs.bottom} rounded-full blur-3xl transition-all duration-500`}
        />
      </div>

      {/* 桌面端：左右两栏布局 */}
      <div className="hidden lg:flex h-screen">
        {/* 左侧编辑器 */}
        <div className="w-1/2 border-r border-border bg-background/50 backdrop-blur-sm">
          <EditorForm
            data={profileData}
            onChange={setProfileData}
            theme={theme}
            onThemeChange={setTheme}
          />
        </div>

        {/* 右侧预览 */}
        <div className="w-1/2">
          <Preview data={profileData} theme={theme} />
        </div>
      </div>

      {/* 移动端：只显示预览 */}
      <div className="lg:hidden flex-1 relative">
        <Preview data={profileData} theme={theme} />

        {/* 编辑按钮 */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`fixed bottom-6 right-6 w-14 h-14 ${themeStyle.primary} text-white rounded-full shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center z-50`}
          >
            <Edit className="w-6 h-6" />
          </button>
        )}

        {/* 编辑模态框 */}
        {isEditing && (
          <div className="fixed inset-0 bg-background z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">编辑资料</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-background/80 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EditorForm
                data={profileData}
                onChange={setProfileData}
                theme={theme}
                onThemeChange={setTheme}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className={`py-6 text-center border-t ${themeStyle.border} lg:border-t-0`}
      >
        <p className={`text-xs ${themeStyle.mutedForeground}`}>
          © 2026 {profileData.name}. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
