export const AvatarUser = ({ user }) => {
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={initials}
        className="w-10 h-10 rounded-full object-cover border-2 border-[#ffb8b2]/80 shadow-[0_0_0_6px_rgba(255,255,255,0.18)]"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff8b6d] via-[#d14c3b] to-[#8b0000] flex items-center justify-center text-sm font-semibold uppercase text-white shadow-[0_16px_40px_rgba(139,0,0,0.35)] ring-2 ring-white/20 shrink-0">
      {initials}
    </div>
  );
};
