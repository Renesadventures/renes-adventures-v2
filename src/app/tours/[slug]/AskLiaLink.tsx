'use client';

export default function AskLiaLink({ message, className }: { message: string; className?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('lia:open', { detail: { message } }));
      }}
      className={className}
    >
      Ask Lia for more reviews
    </a>
  );
}
