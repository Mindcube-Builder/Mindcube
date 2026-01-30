"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Volume2 } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function SessionPage() {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const [isListening, setIsListening] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: uid(),
      role: "assistant",
      content: "欢迎来到 Mindshift。我们即将开启一场奇妙的心灵旅程，如果你准备好了，请对我说\"开始\"吧！",
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // 添加 AbortController ref 来管理请求取消
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const supportsSpeechRecognition = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }, []);

  const supportsSpeechSynthesis = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return "speechSynthesis" in window;
  }, []);

  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!supportsSpeechRecognition) return;
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "zh-CN";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setInput(text.trim());
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    recognitionRef.current = rec;
  }, [supportsSpeechRecognition]);

  // 组件卸载时清理未完成的请求
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    // 取消之前的请求，防止重叠
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 获取最新的消息历史，避免闭包陷阱
      const currentMessages = [...messages, userMsg];
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: abortController.signal, // 添加信号
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.type === 'message') {
        // 普通对话，显示 AI 的文本
        const assistantMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        
        // 检查是否包含结束标识符
        if (data.message.includes('[TEST_COMPLETE]') && data.imageUrl) {
          // 包含结束标识符且有图片 URL，跳转到结果页面
          router.push(`/result?imageUrl=${encodeURIComponent(data.imageUrl)}&analysisText=${encodeURIComponent(data.analysisText || data.message)}`);
        }
      } else if (data.type === 'final') {
        // 检查 JSON 数据是否完整且对话确认结束
        if ((data.rawData?.isFinal === true && data.rawData?.status === 'completed') || data.imageUrl) {
          // 返回了 imageUrl 或 isFinal 为 true 且 status 为 completed，引导用户跳转到 /result 页面
          router.push(`/result?imageUrl=${encodeURIComponent(data.imageUrl || '')}&analysisText=${encodeURIComponent(data.analysisText || '')}`);
        } else {
          // 不满足跳转条件，将消息作为普通对话显示
          const assistantMsg: ChatMessage = {
            id: uid(),
            role: "assistant",
            content: data.message || "会话已完成",
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      }
    } catch (error: any) {
      // 忽略取消请求的错误
      if (error.name !== 'AbortError') {
        console.error('Error sending message:', error);
        const errorMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: "连接中断，请重试",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      // 清理 AbortController
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  }

  function toggleMic() {
    if (!supportsSpeechRecognition) return;
    const rec = recognitionRef.current;
    if (!rec) return;
    if (isListening) {
      rec.stop();
      return;
    }
    setIsListening(true);
    rec.start();
  }

  function speakLatestAssistant() {
    if (!supportsSpeechSynthesis) return;
    const latest = [...messages].reverse().find((m) => m.role === "assistant");
    if (!latest) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(latest.content.replaceAll("\n", " "));
    u.lang = "zh-CN";
    window.speechSynthesis.speak(u);
  }

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Session</h1>
            <p className="text-sm text-muted-foreground">
              极简对话（语音输入/语音播放为浏览器能力演示）
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={speakLatestAssistant}
              disabled={!supportsSpeechSynthesis}
              aria-label="语音播放"
              title={supportsSpeechSynthesis ? "语音播放" : "当前浏览器不支持语音播放"}
            >
              <Volume2 className="size-4" />
            </Button>
          </div>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={[
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    ].join(" ")}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t bg-card p-3">
            <div className="flex items-end gap-2">
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleMic}
                disabled={!supportsSpeechRecognition}
                aria-label="语音输入"
                title={
                  supportsSpeechRecognition
                    ? isListening
                      ? "正在聆听…点击停止"
                      : "点击开始语音输入"
                    : "当前浏览器不支持语音识别"
                }
              >
                <Mic className="size-4" />
              </Button>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入你的想法（支持回车发送）"
                className="min-h-[44px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="发送"
                title="发送"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              小提示：Enter 发送，Shift+Enter 换行。
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

