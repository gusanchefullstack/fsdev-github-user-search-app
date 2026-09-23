import styles from '../styles/ProfileStats.module.css'

interface ProfileStatsProps {
  repos: number
  followers: number
  following: number
}

function ProfileStats({ repos, followers, following }: ProfileStatsProps) {
  const stats = [
    { label: 'Repos', value: repos },
    { label: 'Followers', value: followers },
    { label: 'Following', value: following },
  ]

  return (
    <dl className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <dt className={styles.label}>{stat.label}</dt>
          <dd className={styles.value}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default ProfileStats
