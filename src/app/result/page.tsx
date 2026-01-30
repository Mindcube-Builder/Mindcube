'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('imageUrl') || '';
  const analysisText = searchParams.get('analysisText') || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generateImage() {
    if (!analysisText) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('开始生成图片...');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `请根据以下分析生成一张意象图片：${analysisText}`
            }
          ]
        }),
      });

      console.log('API 响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API 错误:', errorData);
        setError(`生成图片失败: ${errorData.error || '未知错误'}`);
        return;
      }

      const data = await response.json();
      console.log('API 响应数据:', data);
      
      if (data.type === 'final' && data.imageUrl) {
        // 更新URL参数以显示生成的图片
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('imageUrl', data.imageUrl);
        window.history.replaceState({}, '', newUrl);
      } else {
        setError('生成图片失败，请重试');
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(`生成图片失败: ${err.message || '网络错误'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-6 px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Result</h1>
            <p className="text-sm text-muted-foreground">
              AI 意象生成 + 心理分析报告
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/session">回到 Session</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/3] w-full bg-muted">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">生成中...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="AI 意象生成"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Button onClick={generateImage} variant="outline">
                    AI 意象生成
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-base font-semibold tracking-tight">心理分析报告</h2>
            <div className="mt-3 space-y-4 text-sm leading-7">
              {analysisText ? (
                <p className="whitespace-pre-line">{analysisText}</p>
              ) : (
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-2/3 bg-muted rounded"></div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-6">
                免责声明：此报告仅为信息与自我探索用途，不构成专业诊断或治疗建议。
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

