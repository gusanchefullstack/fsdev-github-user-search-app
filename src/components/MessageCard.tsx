import styles from '../styles/MessageCard.module.css'

export type MessageView = 'not-found' | 'rate-limited' | 'error'

// Friendly copy for every failure; technical details are never shown (contracts/ui-contract.md).
const MESSAGES: Record<MessageView, { title: string; body: string }> = {
  'not-found': {
    title: 'No results found!',
    body: 'We couldn’t find any GitHub users matching your search. Please double-check the username and try again.',
  },
  'rate-limited': {
    title: 'Search limit reached',
    body: 'GitHub limits how many searches can be made each hour. Please wait a few minutes and try again.',
  },
  error: {
    title: 'Something went wrong',
    body: 'We couldn’t reach GitHub right now. Please check your connection and try again.',
  },
}

interface MessageCardProps {
  view: MessageView
}

function MessageCard({ view }: MessageCardProps) {
  const { title, body } = MESSAGES[view]
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
    </div>
  )
}

export default MessageCard
