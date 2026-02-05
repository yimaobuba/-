import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  try {
    // 1. 安全地等待参数
    const params = await props.params;
    const id = params?.id;

    if (!id) return notFound();

    // 2. 从数据库读取数据
    const key = `user:${id}`;
    const userData: any = await kv.get(key);

    // 3. 没找到数据返回 404
    if (!userData) {
      return notFound();
    }

    // 4. 渲染页面（带安全检查）
    return (
      <main className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
        <div className="max-w-md w-full py-12 flex flex-col items-center space-y-6">
          <div className="text-center space-y-2">
            {/* 头像安全显示 */}
            <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto overflow-hidden border-2 border-white/10 flex items-center justify-center">
              {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl opacity-20">👤</span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold pt-2">{userData.name || 'Anonymous'}</h1>
            <p className="text-gray-400">{userData.bio || ''}</p>
          </div>

          {/* 链接列表安全渲染 */}
          <div className="w-full space-y-4 pt-4">
            {userData.links && Array.isArray(userData.links) ? (
              userData.links.map((link: any, index: number) => {
                // 防止 link.url 为空导致报错
                const url = link.url || '#';
                const finalUrl = url.startsWith('http') ? url : `https://${url}`;
                
                return (
                  <a
                    key={index}
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-center transition-all font-medium"
                  >
                    {link.title || 'Untitled Link'}
                  </a>
                );
              })
            ) : (
              <p className="text-gray-500 text-center italic">No links added yet.</p>
            )}
          </div>
          
          <p className="text-gray-600 text-[10px] pt-8">BUILD WITH VIBE CODING</p>
        </div>
      </main>
    );
  } catch (error: any) {
    // 5. 如果中间任何一步崩了，显示这个友好的错误界面，而不是 500 页面
    return (
      <div className="min-h-screen bg-black text-red-400 p-10 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2">加载出错了</h2>
        <p className="text-sm opacity-80">{error.message}</p>
        <a href="/" className="mt-4 text-white underline text-xs">返回首页重新生成</a>
      </div>
    );
  }
}