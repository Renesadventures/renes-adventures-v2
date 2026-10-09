import { NextRequest, NextResponse, after } from 'next/server';
import { z } from 'zod';
import { captureChatLead } from '@/lib/lia-chat-lead';
import { liaReply } from '@/lib/lia-brain';

/**
 * The website chat.
 *
 * This route used to carry a 360-line system prompt inline, which meant the
 * website had one Lia and the Facebook and Instagram inboxes had none. Her
 * character, her knowledge and her limits now live in src/lib/lia-brain and
 * every channel calls the same function, so there is exactly one place to
 * change what she says.
 *
 * What this route still owns: validating the request, and handing any contact
 * details the guest shared to Lia Desk after the reply has gone out.
 */

export const runtime = 'nodejs';

const RequestSchema = z
  .object({
    message: z.string().min(1).max(2000).optional(),
    messages: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().max(2000),
        }),
      )
      .optional()
      .default([]),
    context: z.unknown().optional(),
  })
  .superRefine((val, ctx) => {
    const hasMessage = typeof val.message === 'string' && val.message.trim().length > 0;
    const hasMessages = Array.isArray(val.messages) && val.messages.length > 0;
    if (!hasMessage && !hasMessages) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either message or messages is required',
      });
    }
  });

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request format', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { message, messages } = parsed.data;

    const effectiveMessage =
      message ??
      messages
        .slice()
        .reverse()
        .find((m) => m.role === 'user')?.content ??
      '';

    if (!effectiveMessage.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const rawContext = (body as { context?: unknown })?.context as
      | { pageName?: string; selectedTour?: string }
      | undefined;

    const result = await liaReply({
      channel: 'web',
      history: messages,
      message: effectiveMessage,
      context: {
        pageName: typeof rawContext?.pageName === 'string' ? rawContext.pageName : undefined,
        selectedTour:
          typeof rawContext?.selectedTour === 'string' ? rawContext.selectedTour : undefined,
      },
    });

    if (result.handoffs.length) {
      // Visible in the Vercel log even when the guest never leaves details, so
      // the pattern of what Lia is handing over can be read back later.
      console.log('[lia] handoff', {
        page: rawContext?.pageName,
        reasons: result.handoffs.map((h) => h.reason),
      });
    }

    // Lead capture runs after the response, so the guest never waits on the CRM.
    after(async () => {
      try {
        await captureChatLead(
          messages,
          effectiveMessage,
          result.text,
          typeof rawContext?.pageName === 'string' ? rawContext.pageName : undefined,
          result.summary,
        );
      } catch (err) {
        console.error('[lia-chat] lead capture failed (non-fatal):', err);
      }
    });

    return NextResponse.json({ message: result.text });
  } catch (error: unknown) {
    console.error('[lia] concierge route error', {
      message: error instanceof Error ? error.message : String(error),
      ip,
    });
    return NextResponse.json(
      { error: "I apologize, but I'm having trouble right now. Please try again in a moment!" },
      { status: 500 },
    );
  }
}
