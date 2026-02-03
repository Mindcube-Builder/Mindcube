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
        <p className="text-xs tracking-[0.28em] text-muted-foreground/70 font-light">MINDCUBE AI</p>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
          从混乱的思绪中，映射内心的答案
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground/70 sm:text-lg font-light">
          AI 驱动的深度心理探索之旅：在对话中洞见自我，于重构中获得疗愈
        </p>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link href="/session">开始旅程</Link>
          </Button>
          
          {/* Feature Introduction Container - Frosted Glass Effect */}
          <div className="mt-8 max-w-2xl w-full backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/8 transition-all duration-500">
            <div className="flex items-start gap-5 text-left">
              <div className="flex-shrink-0 mt-0.5">
                <span 
                  className="text-2xl inline-block animate-pulse" 
                  style={{ 
                    animationDuration: '3s',
                    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                  }}
                >
                  ✨
                </span>
              </div>
              <div className="flex-1 space-y-3 font-mono text-sm leading-relaxed">
                <p className="text-foreground/90 tracking-wide">
                  基于认知科学的互动探索，AI 引导思绪梳理
                </p>
                <p className="text-muted-foreground/70 tracking-wide">
                  在对话中生成专属心理画像，洞见未知的自我
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-xs text-muted-foreground/60 font-light">
          仅为演示原型：不替代专业医疗/心理诊断。
        </p>
      </main>
    </div>
  );
}
