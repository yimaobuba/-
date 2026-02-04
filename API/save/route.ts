import { createClient } from '@vercel/kv';
import { NextResponse } from 'next/server';
const kv = createClient({
  url: 'https://full-crayfish-35919.upstash.io',
  token: 'AYxPAAIncDE1ZjE1ZjhkOTQ3NjU0MThhYTlkYTA4MzdjYzg2MTg4YnAxMzU5MTk',
});

export async function POST(request: Request) {
  try {
    // 1. 获取环境变量
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    // 2. 检查环境变量是否存在
    if (!url || !token) {
      return NextResponse.json({ 
        error: '关键报错：Vercel环境变量缺失', 
        details: '请去Settings确认KV变量是否存在，并务必执行Redeploy' 
      }, { status: 500 });
    }

    // 3. 初始化数据库并写入
    const kv = createClient({ url, token });
    const userData = await request.json();
    const uniqueId = Math.random().toString(36).substring(2, 8);
    
    await kv.set(`user:${uniqueId}`, userData);

    return NextResponse.json({ uniqueId });

  } catch (err: any) {
    // 4. 将最原始的报错信息 (err.message) 返回给前端
    return NextResponse.json({ 
      error: '后端执行异常', 
      details: err.message || '未知错误详情'
    }, { status: 500 });
  }
}