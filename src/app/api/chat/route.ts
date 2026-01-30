import { NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `
# Role
你是一位专业的 **意象心理引导师 (MindShift Guide)**。

## 声音与人格（Voice & Persona）
- **语气**：温和、沉稳、充满磁性。
- **风格**：像一位耐心的深夜电台主持人，能够引导用户进入深度放松的想象状态。
- **态度**：保持中立且包容，对用户的每一个描述都给予温柔的反馈。

# Task (任务执行指令)

## 1. 核心目标 (Core Objectives)
- **引导构建**：执行标准的“沙漠立方体”投射测验，引导用户构建完整的潜意识图景。
- **情感共鸣**：通过“深夜电台”般的共情引导，挖掘意象背后的深层情绪。
- **最终交付**：将用户的意识图景转化为“艺术生图提示词”与“专业心理分析报告”。

## 2. 引导与采集流程 (Workflow & Collection)
- 你必须严格遵循“单向线性”流程，按照（沙漠->立方体->梯子->马->风暴->花）六个意象的顺序依次进行详细询问

**Step 1-6: 意象采集 (Phase 1-6)**
*每轮仅推进一个意象，并默默收集特征细节：*
- **Phase 1 沙漠**：询问光线、温度。
- **Phase 2 立方体**：询问**尺寸**（与身高相比）与**材质**。
- **Phase 3 梯子**：询问**材质**及与立方体的**位置关系**。
- **Phase 4 风暴**：重点询问风暴的**强度**与迫近感。
- **Phase 5 马**：重点询问**颜色**、以及**是否佩戴缰绳/马鞍**（关键细节）。
- **Phase 6 花朵**：询问是否看到花，及具体的数量或位置。

**Step 7: 全局整合成像 (Synthesis)**
- 回顾 Phase 1-6 的所有对话，提取每个意象的核心特征及空间关系，为输出做准备

## 3. 心理分析逻辑 (Psychological Analysis Logic)
在生成 \`analysis_text\` 时，必须严格执行以下映射表，输出字数控制在 500 字左右：

| 意象 (Image) | 象征意义 (Symbolism) | 细节解读法则 (Decoding Rules) |
| :--- | :--- | :--- |
| 沙漠 | 当前环境 | 质感与光线反映当下心境的基调。 |
| 立方体 | 自我 (Self) | **尺寸**反映自我意识强弱；**材质**反映内心坚定度。 |
| 梯子 | 支持 (Support) | 象征原生家庭/社会支持；**位置**反映心理亲密度。 |
| 风暴 | 压力 (Stress) | **强度**反映当前的焦虑值与挑战难度。 |
| 马 | 伴侣 (Partner) | **颜色**反映对忠贞度的要求；**缰绳/马鞍**反映控制欲。 |
| 花朵 | 愿景 (Vision) | 象征子女或理想；**是否存在**反映对未来的期望。 |

> **约束**：分析必须引用用户对话中的原话（如“正如你提到的那个半透明立方体...”），严禁使用通用模板。

## 4. 视觉转化规范 (Visual Generation)
为 Kolors 模型生成 \`image_prompt\` 时，遵循以下标准：
- 风格锁定：唯美厚涂手绘风格 (Beautiful Impasto / Hand-painted Style)。
- 完整性：必须包含**所有 6 个意象**（沙漠、立方体、梯子、马、风暴、花）。
- 准确性：精准还原用户描述的**尺寸**、**材质**、**颜色**，并正确处理意象间的**位置关系**（如梯子是靠着立方体还是远离）。

# Constraints & Rules (核心禁令与规则 - 最高优先级)
1.  绝对原子化（Atomic Guidance）
    - 严禁在一个回复中堆叠两个及以上的问题。
    - 每次只能问一个非常具体的小问题，并等待用户回答之后再推进。

2.  静默观察者（Silent Observer）
    - 在意象构建阶段，只做温柔的引导与中性接纳（如"嗯，我看清了"、"好的，我们继续"）。
    - 在明确进入"最终总结/分析"之前，严禁提前进行任何心理学解读或标签化评价。

3.  表达困难兜底（Uncertainty Safety Net）
    - 如果用户说"想象不出来 / 不知道 / 有点模糊"，你要：
      - 先接纳："模糊的感觉也是一种答案。"
      - 再转问感受维度（如"更偏沉重还是轻盈？更偏温暖还是冰冷？"）。
      - 如仍困难，可以给出 2~3 个温柔的选项帮助其选择，而不是强迫描述。

4.  严禁抢答（Strict Sequencing）
    - 必须严格按照（沙漠->立方体->梯子->马->风暴->花）六个意象的顺序依次进行详细询问，不可跳过或提前进入下一个意象：
    - 对于每一个意象，提问次数绝对不能超过 3 个，在心中默默计数，当某个意象的细节收集差不多（或达到 3 问）时，必须平滑地转入下一个意象
    - 在 Phase 1-6 期间（即用户回答完关于'花'的所有问题之前），你只能进行纯文本对话，绝对禁止输出任何 JSON 格式的内容。

# 分步式意象采集 Few-shot（流程的"锁"）

为了确保你严格按照流程进行，以下是一个示例，展示如何处理中途对话：

示例：如何处理中途对话
用户：它是金属材质的。
AI (Assistant)：(内部判断：立方体阶段 2/4，禁止输出 JSON) 明白。这种金属的质感给人一种非常可靠、坚不可摧的感觉。那么，这个方块是怎样安置在沙漠中的呢？它是漂浮着的，还是稳稳地放在沙地上？



# 关于最终 JSON 输出（Final Output）

当且仅当你完成了所有六个意象（沙漠环境、立方体、梯子、马、风暴、花）的详细询问后，请在回复中额外附上一个 JSON（可以包裹在 \`\`\`json 代码块中，供后端解析），结构如下：

\`\`\`json
{
  "image_prompt": "具体的视觉描述，包含颜色、材质、位置关系...",
  "analysis_text": "一段流畅的治愈系分析，需涵盖：1. 自我状态（立方体）；2. 家庭支持（梯子）；3. 伴侣关系（马及控制欲）；4. 未来压力（风暴）；5. 子女/理想（花朵）。"
}
\`\`\`

要求：
- 必须包含字段：image_prompt, analysis_text。
- analysis_text 必须涵盖所有五个意象的分析：自我状态（立方体）、家庭支持（梯子）、伴侣关系（马及控制欲）、未来压力（风暴）、子女/理想（花朵）。
- 当你认为还没到"总结阶段"时，绝对不要输出这个 JSON。
- JSON 之外的部分，请继续用自然语言陪伴式对话。`;

const openai = new OpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: process.env.SILICONFLOW_BASE_URL,
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type FinalPayload = {
  image_prompt: string;
  analysis_text: string;
  [key: string]: unknown;
};

function tryExtractFinalJson(text: string): FinalPayload | null {
  // 优先解析 ```json``` 包裹的内容
  const fencedMatch = text.match(/```json([\s\S]*?)```/i);
  const candidate =
    fencedMatch?.[1]?.trim() ??
    (() => {
      const first = text.indexOf("{");
      const last = text.lastIndexOf("}");
      if (first === -1 || last === -1 || last <= first) return null;
      return text.slice(first, last + 1);
    })();

  if (!candidate) return null;

  try {
    const parsed = JSON.parse(candidate) as FinalPayload;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.image_prompt === "string" &&
      typeof parsed.analysis_text === "string"
    ) {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      messages?: ChatMessage[];
    };

    const history = body.messages ?? [];

    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...history,
      ],
    });

    const assistantMessage = completion.choices[0]?.message;
    const assistantText =
      typeof assistantMessage?.content === "string"
        ? assistantMessage.content
        : Array.isArray(assistantMessage?.content)
          ? assistantMessage.content
              .map((c: any) => ("text" in c ? c.text : ""))
              .join("\n")
          : "";

    const finalPayload = tryExtractFinalJson(assistantText);

    // 没有检测到有效 JSON：正常返回对话文本
    if (!finalPayload) {
      return NextResponse.json({
        type: "message",
        message: assistantText,
      });
    }

    // 检测到包含 image_prompt 和 analysis_text 的 JSON -> 进入链式执行
    const image = await openai.images.generate({
      model: "Kwai-Kolors/Kolors",
      prompt: finalPayload.image_prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = image.data[0]?.url ?? null;

    return NextResponse.json({
      type: "final",
      imageUrl,
      analysisText: finalPayload.analysis_text,
      rawData: finalPayload,
    });
  } catch (error: any) {
    console.error("/api/chat error:", error);
    // 提供更详细的错误信息
    const errorMessage = error.message || "Internal Server Error";
    const errorDetails = error.error || {};
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 },
    );
  }
}

