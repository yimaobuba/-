import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // 1. 关键修复：在 Next.js 15 中必须 await params
  const { id } = await params;
  
  if (!id) return notFound();

  // 2. 从数据库读取数据
  const key = `user:${id}`;
  const userData: any = await kv.get(key);

  // 3. 如果没找到数据，显示 404
  if (!userData) {
    notFound();
  }

  // 4. 成功拿到数据，渲染漂亮的主页
  return (
    <main className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <div className="max-w-md w-full py-12 flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          {/* 头像 */}
          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto overflow-hidden border-2 border-white/10">
            {userData.avatarUrl && <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />}
          </div>
          {/* 名字和简介 */}
          <h1 className="text-2xl font-bold pt-2">{userData.name || 'Anonymous'}</h1>
          <p className="text-gray-400">{userData.bio}</p>
        </div>

        {/* 链接按钮 */}
        <div className="w-full space-y-4 pt-4">
          {userData.links?.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-center transition-all font-medium"
            >
              {link.title}
            </a>
          ))}
        </div>
        
        <p className="text-gray-600 text-xs pt-8">Powered by Vibe Link</p>
      </div>
    </main>
  );
}