import { kv } from '@vercel/kv';

export default async function DebugPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const key = `user:${id}`;
  
  // 尝试读取
  const userData = await kv.get(key);

  if (!userData) {
    return (
      <div style={{ padding: '20px', color: 'white', background: 'black', minHeight: '100vh' }}>
        <h1>路径检查：/u/[id] 已生效</h1>
        <p>当前查询的 ID 是：{id}</p>
        <p>数据库查询的 Key 是：{key}</p>
        <p style={{ color: 'red' }}>结果：数据库中找不到该数据！请回到主页重新生成一个 ID 再试。</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white', background: 'black', minHeight: '100vh' }}>
      <h1>🎉 恭喜！数据读取成功</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}