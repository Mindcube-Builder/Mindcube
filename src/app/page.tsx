export const dynamic = 'force-dynamic';
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Desert ambiance background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,oklch(0.97_0.04_85)_0%,transparent_60%),radial-gradient(70%_60%_at_30%_70%,oklch(0.92_0.06_65)_0%,transparent_60%),radial-gradient(60%_50%_at_70%_80%,oklch(0.86_0.08_55)_0%,transparent_60%)] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.98_0.01_80)_35%,transparent_100%)] opacity-60" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(oklch(0.2_0_0)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <main className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-xs tracking-[0.24em] text-muted-foreground">CUBE-THERAPY AI</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          把混乱折叠成秩序
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          极简的对话式心理疗愈体验。你说，我听；你写，我陪。
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link href="/session">开始旅程</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="rounded-full px-7">
            <Link href="/result">查看示例结果</Link>
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          仅为演示原型：不替代专业医疗/心理诊断。
        </p>
      </main>
    </div>
  );
}
