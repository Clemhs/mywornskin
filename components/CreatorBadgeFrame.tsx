// components/CreatorBadgeFrame.tsx
import Image from 'next/image';

type Props = {
  salesBadge?: number | null;
  frame?: string | null;
  avatarUrl: string;
  size?: number;
};

export default function CreatorBadgeFrame({ salesBadge, frame, avatarUrl, size = 120 }: Props) {
  return (
    <div className="relative inline-block">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="rounded-2xl object-cover border-4 border-zinc-950"
        width={size}
        height={size}
      />

      {/* Cadre animé */}
      {frame && (
        <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${frame}`} />
      )}

      {/* Badge ventes */}
      {salesBadge && (
        <img
          src={`/badges/${salesBadge}.png`}
          alt={`Badge ${salesBadge} ventes`}
          className="absolute -top-3 -right-3 w-16 h-16 drop-shadow-2xl"
        />
      )}
    </div>
  );
}
