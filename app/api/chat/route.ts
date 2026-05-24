import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/chatKnowledge';

export const runtime = 'edge'; // Faster, lower latency

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Message[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'الرسائل مطلوبة' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    if (lastMessage.length > 1000) {
      return NextResponse.json({ error: 'الرسالة طويلة جداً' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Fallback: rule-based responses when no API key
      return NextResponse.json({
        reply: getRuleBasedReply(lastMessage),
        source: 'fallback',
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-8), // Keep last 8 messages for context
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return NextResponse.json({
        reply: getRuleBasedReply(lastMessage),
        source: 'fallback',
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'عذراً، لم أتمكن من الرد. يرجى المحاولة مرة أخرى.';

    return NextResponse.json({ reply, source: 'ai' });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      reply: 'عذراً، حدث خطأ مؤقت. يمكنك التواصل معنا مباشرة عبر واتساب للمساعدة الفورية! 📱',
      source: 'error',
    }, { status: 200 }); // Return 200 so UI doesn't break
  }
}

// ── Rule-based fallback (works without API key) ──────────
function getRuleBasedReply(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('متر') || msg.includes('كمية') || msg.includes('كم متر')) {
    return 'لحساب كمية القماش بدقة، استخدمي حاسبة القماش الذكية في موقعنا! 🧮\n\nكقاعدة عامة:\n• فستان ضيق: 3 متر\n• فستان واسع: 4-5 متر\n• عباية: 4-5 متر\n• تنورة: 1.5-2 متر\n\nأضيفي 0.5 متر إضافي دائماً للأمان 😊';
  }

  if (msg.includes('بشرة فاتح') || msg.includes('بشرتي فاتح')) {
    return '🌸 البشرة الفاتحة تتألق مع:\n• الليلكي والبنفسجي\n• الأزرق السماوي والكحلي\n• الوردي الباستيل\n• الفضي والرمادي الفاتح\n\nتجنبي البيج الأصفر. الألوان الباردة هي الأفضل لك! ✨';
  }

  if (msg.includes('بشرة أسمر') || msg.includes('بشرة داكن')) {
    return '👸 البشرة الداكنة تتألق بشكل استثنائي مع:\n• الأبيض الناصع\n• الأصفر الذهبي\n• الفيروزي والفوشيا\n• البرتقالي والأحمر\n\nالألوان الجريئة والمشرقة هي صديقتك! 🌟';
  }

  if (msg.includes('فرح') || msg.includes('عرس') || msg.includes('زفاف')) {
    return '💍 للأفراح والأعراس:\n• جورجيت ملون فاخر\n• ساتان بلون جريء\n• شيفون مطرز\n\n🎨 الألوان المناسبة: خمري، ذهبي، أزرق ملكي، أخضر زمردي\n\n❌ تجنبي الأبيض والكريمي (هذا للعروس فقط)';
  }

  if (msg.includes('عروس') || msg.includes('زواج')) {
    return '👰 للعروس:\n• الساتان الأبيض أو العاجي هو الكلاسيك الأبدي\n• الحرير الطبيعي للفخامة القصوى\n• الدانتيل الفرنسي لإطلالة أسطورية\n\n💡 نصيحة: استثمري في قماش جيد — هذا يومك الأجمل!\n\nلدينا ساتان ملكي وحرير طبيعي بأعلى جودة 🌟';
  }

  if (msg.includes('صيف') || msg.includes('حر')) {
    return '☀️ لصيف السعودية الحار:\n• قطن مصري (الأفضل!)\n• شيفون خفيف\n• جورجيت خفيف\n• كتان\n\n✅ الألوان الفاتحة تعكس الحرارة\n❌ تجنبي البوليستر — يحبس الحرارة!\n\nلدينا قطن مصري فاخر بـ 45 ر.س/م فقط 🌿';
  }

  if (msg.includes('عزاء') || msg.includes('وفاة')) {
    return 'للعزاء اختاري:\n• الأسود هو الأفضل\n• الرمادي الغامق\n• الكحلي الغامق\n\n👗 قماش هادئ مثل الكريب أو الجورجيت غير اللامع\n❌ تجنبي الألوان الزاهية والبراقة';
  }

  if (msg.includes('كريب') || msg.includes('جورجيت') || msg.includes('ساتان') || msg.includes('شيفون') || msg.includes('حرير')) {
    return '🧵 اختيار رائع! لدينا تشكيلة واسعة من أجود الأقمشة.\n\nتفضلي بزيارة صفحة المنتجات لرؤية كل الخيارات المتاحة والأسعار، أو تواصلي معنا مباشرة لمساعدتك في الاختيار المثالي! 💫';
  }

  if (msg.includes('سعر') || msg.includes('كم سعر') || msg.includes('كم التكلفة')) {
    return '💰 أسعارنا التنافسية:\n• جورجيت فاخر: 85 ر.س/م\n• شيفون: 65 ر.س/م\n• قطن مصري: 45 ر.س/م\n• كريب: 95 ر.س/م\n• ساتان ملكي: 250 ر.س/م\n• قطيفة: 180 ر.س/م\n• دانتيل فرنسي: 320 ر.س/م\n• حرير طبيعي: 450 ر.س/م\n\nجودة عالية بأسعار منافسة! 🌟';
  }

  if (msg.includes('توصيل') || msg.includes('شحن') || msg.includes('ينبع') || msg.includes('جدة')) {
    return '🚚 نوصل لجميع مناطق المملكة العربية السعودية!\n\n📍 موقعنا: ينبع، المنطقة الغربية\n✅ شحن مجاني للطلبات فوق 200 ر.س\n⚡ توصيل سريع خلال 2-5 أيام عمل';
  }

  if (msg.includes('مرحبا') || msg.includes('السلام') || msg.includes('أهلا') || msg.includes('هاي')) {
    return '👋 أهلاً وسهلاً! أنا "سدى" مستشارتك للأقمشة في بن صديق.\n\nيسعدني مساعدتك في:\n• اختيار القماش المناسب\n• حساب الكميات\n• ألوان تناسب بشرتك\n• نصائح المناسبات\n\nما الذي تودين معرفته؟ 🧵✨';
  }

  // Default
  return '🧵 شكراً لتواصلك مع بن صديق للأقمشة!\n\nيمكنني مساعدتك في:\n• حساب كمية القماش\n• اختيار الألوان المناسبة لبشرتك\n• أفضل قماش لكل مناسبة\n• نصائح الموديلات\n\nما الذي تودين معرفته تحديداً؟ 😊';
}
