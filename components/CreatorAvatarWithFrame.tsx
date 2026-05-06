// components/CreatorAvatarWithFrame.tsx
import Image from 'next/image';

type Props = {
  avatarUrl?: string;
  bannerUrl?: string;
  salesBadge?: number | null;
  frame?: string | null;
  size?: number;           // taille de l'avatar
  className?: string;
};

export default function CreatorAvatarWithFrame({
  avatarUrl,
  bannerUrl,
  salesBadge,
  frame,
  size = 80,
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Photo de couverture en fond */}
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt="Couverture"
          className="w-full h-full object-cover rounded-3xl"
        />
      )}

      {/* Avatar avec cadre et badge */}
      <div className="absolute -bottom-6 left-6">
        <div className="relative">
          <img
            src={avatarUrl || "https://picsum.photos/id/64/300/300"}
            alt="Avatar"
            className="w-[80px] h-[80px] rounded-2xl border-4 border-zinc-950 object-cover"
            width={size}
            height={size}
          />

          {/* Cadre animé */}
          {frame && (
            <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${frame}`} />
          )}

          {/* Badge de ventes */}
          {salesBadge && (
            <img
              src={`/badges/${salesBadge}.png`}
              alt={`Badge ${salesBadge}`}
              className="absolute -top-3 -right-3 w-14 h-14 drop-shadow-2xl z-10"
            />
          )}
        </div>
      </div>
    </div>
  );
}
