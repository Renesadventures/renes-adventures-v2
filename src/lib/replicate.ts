/**
 * Replicate client + generation helpers.
 * Activates when REPLICATE_API_TOKEN is set. Models are env-overridable so
 * the pipeline never breaks if a model slug changes on Replicate's side.
 */
import Replicate from 'replicate';

export const IMAGE_MODEL =
  process.env.REPLICATE_IMAGE_MODEL || 'black-forest-labs/flux-schnell';
export const VIDEO_MODEL =
  process.env.REPLICATE_VIDEO_MODEL || 'wan-video/wan-2.2-t2v-fast';

export function replicateConfigured(): boolean {
  return Boolean(process.env.REPLICATE_API_TOKEN);
}

function getClient(): Replicate {
  const auth = process.env.REPLICATE_API_TOKEN;
  if (!auth) throw new Error('REPLICATE_API_TOKEN not set');
  return new Replicate({ auth });
}

/** Normalize Replicate output (string | FileOutput | array) to a URL string. */
function toUrl(output: unknown): string {
  const first = Array.isArray(output) ? output[0] : output;
  if (!first) throw new Error('Replicate returned no output');
  if (typeof first === 'string') return first;
  const maybe = first as { url?: () => URL | string };
  if (typeof maybe.url === 'function') return String(maybe.url());
  return String(first);
}

export async function generateImage(prompt: string): Promise<string> {
  const replicate = getClient();
  const output = await replicate.run(IMAGE_MODEL as `${string}/${string}`, {
    input: {
      prompt,
      aspect_ratio: '1:1',
      output_format: 'jpg',
      output_quality: 90,
    },
  });
  return toUrl(output);
}

export async function generateReel(prompt: string): Promise<string> {
  const replicate = getClient();
  const output = await replicate.run(VIDEO_MODEL as `${string}/${string}`, {
    input: {
      prompt,
      num_frames: 81,
      resolution: '480p',
      aspect_ratio: '9:16',
    },
  });
  return toUrl(output);
}
