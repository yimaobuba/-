import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';

// 这个页面负责把存好的数据读出来并展示
export default async function SharedProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. 从 KV 数据库读取数据 (注意这里的 Key 要和 API 存的时候一致)
  const userData: any = await kv.get(`user:${id}`);

  // 2. 如果没找到数据，直接显示 404
  if (!userData) {
    notFound();
  }

  // 3. 渲染页面（这里直接复用你主页的样式逻辑）
  return (
    <main className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <div className="max-w-md w-full py-12 flex flex-col items-center space-y-6">
        {/* 头像和名字 */}
        <div className="text-center space-y-2">
          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto overflow-hidden">
            {userData.avatarUrl && <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />}
          </div>
          <h1 className="text-2xl font-bold">{userData.name || 'Anonymous'}</h1>
          <p className="text-gray-400">{userData.bio || 'No bio provided'}</p>
        </div>

        {/* 链接列表 */}
        <div className="w-full space-y-4">
          {userData.links?.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-center transition-all"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}