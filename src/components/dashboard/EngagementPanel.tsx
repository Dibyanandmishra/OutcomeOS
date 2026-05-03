import { Award, Lock, Medal, Trophy } from "lucide-react";

type LeaderboardEntry = {
  userId: string;
  name: string;
  hoursSaved: number;
  isCurrentUser: boolean;
};

type Badge = {
  title: string;
  description: string;
  unlocked: boolean;
};

export function EngagementPanel({
  leaderboard,
  badges,
}: {
  leaderboard: LeaderboardEntry[];
  badges: Badge[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section className="premium-surface rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Trophy className="h-5 w-5 text-cyan-300" />
          <h2 className="text-base font-medium text-white">
            Impact Leaderboard
          </h2>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No impact logs yet. Save time with AI and claim the first spot.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 ${
                  entry.isCurrentUser
                    ? "border-cyan-400/30 bg-cyan-400/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="text-xs text-cyan-300 ml-2">You</span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500">Hours saved with AI</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-300 shrink-0">
                  {entry.hoursSaved}h
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="premium-surface rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Medal className="h-5 w-5 text-emerald-300" />
          <h2 className="text-base font-medium text-white">Badges</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className={`rounded-lg border p-4 ${
                badge.unlocked
                  ? "border-emerald-400/25 bg-emerald-400/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {badge.unlocked ? (
                  <Award className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Lock className="h-4 w-4 text-zinc-500" />
                )}
                <h3 className="text-sm font-medium text-white">
                  {badge.title}
                </h3>
              </div>
              <p className="text-xs text-zinc-500">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
