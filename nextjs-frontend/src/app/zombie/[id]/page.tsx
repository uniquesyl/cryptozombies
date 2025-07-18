import ZombieDetailClient from './ZombieDetailClient';

// 为静态导出生成参数
export function generateStaticParams() {
  // 由于僵尸ID是动态的，我们生成一些常见的ID范围
  const params = [];
  for (let i = 0; i < 100; i++) {
    params.push({ id: i.toString() });
  }
  return params;
}

export default async function ZombieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ZombieDetailClient zombieId={id} />;
} 