import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 这里的日志会在 Vercel 的 Logs 页面显示
    console.log("收到保存请求...");

    // 关键排查：手动检查变量是否存在
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      return NextResponse.json({ 
        error: '数据库配置缺失', 
        details: `URL: ${url ? '已存在' : '缺失'}, Token: ${token ? '已存在' : '缺失'}` 
      }, { status: 500 });
    }

    const userData = await request.json();
    const uniqueId = Math.random().toString(36).substring(2, 8);

    // 尝试写入
    await kv.set(`user:${uniqueId}`, userData);

    return NextResponse.json({ uniqueId });
  } catch (error: any) {
    console.error("保存过程报错:", error.message);
    return NextResponse.json({ error: '服务器写入失败', details: error.message }, { status: 500 });
  }
}