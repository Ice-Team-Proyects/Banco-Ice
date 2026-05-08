export const AvatarUser = ({ user }) => {
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={initials}
        className="w-8 h-8 rounded-full object-cover border-2 border-[#003A8F]/20"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-[#003A8F] flex items-center justify-center text-white text-xs font-bold shrink-0">
      {initials}
    </div>
  );
};
