import { createClient } from '@vercel/kv';
import { NextResponse } from 'next/server';

// 💡 重点：我们不再依赖自动初始化，而是手动从环境变量读取
const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // 生成随机 6 位 ID
    const uniqueId = Math.random().toString(36).substring(2, 8);

    // 尝试写入数据。如果环境变量没读到，这里会报具体的错
    await kv.set(`user:${uniqueId}`, userData);

    return NextResponse.json({ uniqueId });
  } catch (error: any) {
    console.error('后端报错详情:', error);
    // 💡 重点：这里我们把最底层的报错传回给你的弹窗，不再用模糊的“保存数据失败”
    return NextResponse.json({ 
      error: '数据库连接失败', 
      details: error.message 
    }, { status: 500 });
  }
}