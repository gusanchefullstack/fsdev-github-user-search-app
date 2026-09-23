import type { ProfileLink, UserProfile } from '../types/github.ts'
import styles from '../styles/ProfileLinks.module.css'

interface LinkItemProps {
  label: string
  icon: string
  link: ProfileLink
}

// One row of the links section. The hidden label ("Company:") gives each link a unique
// accessible name, and missing values render dimmed as "Not Available" (never a link).
function LinkItem({ label, icon, link }: LinkItemProps) {
  const hiddenLabel = (
    <>
      <span className="visuallyHidden">{label}:</span>{' '}
    </>
  )

  let content
  if (link.text && link.href) {
    content = (
      <a className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer">
        {hiddenLabel}
        {link.text}
      </a>
    )
  } else {
    content = (
      <span className={styles.text}>
        {hiddenLabel}
        {link.text ?? 'Not Available'}
      </span>
    )
  }

  return (
    <li className={`${styles.item} ${link.text ? '' : styles.unavailable}`}>
      <span className={`${styles.icon} ${icon}`} aria-hidden="true" />
      {content}
    </li>
  )
}

type ProfileLinksProps = Pick<UserProfile, 'location' | 'twitter' | 'website' | 'company'>

function ProfileLinks({ location, twitter, website, company }: ProfileLinksProps) {
  return (
    <ul className={styles.links}>
      <LinkItem label="Location" icon={styles.location} link={location} />
      <LinkItem label="Twitter" icon={styles.twitter} link={twitter} />
      <LinkItem label="Website" icon={styles.website} link={website} />
      <LinkItem label="Company" icon={styles.company} link={company} />
    </ul>
  )
}

export default ProfileLinks
