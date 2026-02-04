import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// 生成 6 位随机 ID 的辅助函数
function generateShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    // 1. 获取前端传来的用户配置数据
    const userData = await request.json();

    if (!userData) {
      return NextResponse.json({ error: '数据不能为空' }, { status: 400 });
    }

    // 2. 生成一个唯一的 ID
    const uniqueId = generateShortId();

    // 3. 将数据存入 Vercel KV 数据库
    // Key 是生成的 ID，Value 是用户的数据对象
    // 我们设置一个过期时间（比如 30 天，单位是秒），防止数据库爆满，也可以不设
    await kv.set(`user:${uniqueId}`, userData);

    // 4. 返回成功的 ID 给前端
    return NextResponse.json({ uniqueId });
    
  } catch (error) {
    console.error('保存失败:', error);
    return NextResponse.json({ error: '服务器内部错误，保存失败' }, { status: 500 });
  }
}