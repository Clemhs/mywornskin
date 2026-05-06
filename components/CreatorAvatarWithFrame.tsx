// components/CreatorAvatarWithFrame.tsx
export default function CreatorAvatarWithFrame({
  avatarUrl,
  bannerUrl,
  salesBadge,
  frame,
  className = "",
}: {
  avatarUrl?: string;
  bannerUrl?: string;
  salesBadge?: number | null;
  frame?: string | null;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Photo de couverture */}
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt="Couverture"
          className="w-full h-52 object-cover rounded-t-3xl"
        />
      )}

      {/* Avatar + Cadre */}
      <div className="absolute -bottom-8 left-6">
        <div className="relative">
          <img
            src={avatarUrl || "https://picsum.photos/id/64/300/300"}
            alt="Avatar"
            className="w-24 h-24 rounded-2xl border-4 border-zinc-950 object-cover"
          />

          {/* Glow INTERNE */}
          {frame && (
            <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${frame}`} />
          )}

          {/* Badge */}
          {salesBadge && (
            <img
              src={`/badges/${salesBadge}.png`}
              alt={`Badge ${salesBadge}`}
              className="absolute -top-2 -right-2 w-9 h-9 drop-shadow-2xl z-10"
            />
          )}
        </div>
      </div>
    </div>
  );
}
