import type { UserProfile } from '../types/github.ts'
import styles from '../styles/ProfileCard.module.css'
import ProfileLinks from './ProfileLinks.tsx'
import ProfileStats from './ProfileStats.tsx'

interface ProfileCardProps {
  profile: UserProfile
}

function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className={styles.card}>
      <img
        className={styles.avatar}
        src={profile.avatarUrl}
        alt={`Avatar of ${profile.displayName}`}
        width={117}
        height={117}
      />
      <div className={styles.header}>
        <div className={styles.identity}>
          <h2 className={styles.name}>{profile.displayName}</h2>
          <p className={styles.handle}>{profile.handle}</p>
        </div>
        <p className={styles.joined}>
          <time dateTime={profile.joinedIso}>{profile.joinedLabel}</time>
        </p>
      </div>
      <div className={styles.details}>
        <p className={profile.bio ? styles.bio : `${styles.bio} ${styles.noBio}`}>
          {profile.bio ?? 'This profile has no bio'}
        </p>
        <ProfileStats
          repos={profile.repos}
          followers={profile.followers}
          following={profile.following}
        />
        <ProfileLinks
          location={profile.location}
          twitter={profile.twitter}
          website={profile.website}
          company={profile.company}
        />
      </div>
    </div>
  )
}

export default ProfileCard
