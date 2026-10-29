import type { Metadata } from 'next';
import ZhulongClient from '@/components/ZhulongClient';

export const metadata: Metadata = {
  title: '烛龙 · ZHULONG',
  description: '刀痕成矿。弹反把敌人的力刻进石壁，长出矿脉。',
};

export default function ZhulongPage() {
  return <ZhulongClient />;
}
