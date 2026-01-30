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
}: {
  avatarUrl: string
  name: string
  bio: string
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
        <Image
          src={avatarUrl}
          alt={name}
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{name}</h1>
        <p className="text-sm text-muted-foreground max-w-sm">{bio}</p>
      </div>
    </div>
  )
}

// LinkCard 组件
function LinkCard({
  href,
  icon: Icon,
  title,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 w-full p-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-background/90 hover:border-foreground/20 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Icon className="w-5 h-5 text-foreground flex-shrink-0" />
      <span className="font-medium text-foreground">{title}</span>
    </a>
  )
}

// 预览组件
function Preview({ data }: { data: ProfileData }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Profile Section */}
        <ProfileHeader
          avatarUrl={data.avatarUrl}
          name={data.name}
          bio={data.bio}
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
}: {
  data: ProfileData
  onChange: (data: ProfileData) => void
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

  return (
    <main className="min-h-svh flex flex-col">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* 桌面端：左右两栏布局 */}
      <div className="hidden lg:flex h-screen">
        {/* 左侧编辑器 */}
        <div className="w-1/2 border-r border-border bg-background/50 backdrop-blur-sm">
          <EditorForm data={profileData} onChange={setProfileData} />
        </div>

        {/* 右侧预览 */}
        <div className="w-1/2">
          <Preview data={profileData} />
        </div>
      </div>

      {/* 移动端：只显示预览 */}
      <div className="lg:hidden flex-1 relative">
        <Preview data={profileData} />

        {/* 编辑按钮 */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center z-50"
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
              <EditorForm data={profileData} onChange={setProfileData} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border lg:border-t-0">
        <p className="text-xs text-muted-foreground">
          © 2026 {profileData.name}. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
