import { motion } from 'framer-motion'
import type { NexusStore } from '../store/nexusStore'
import { CreateServerFlow } from './CreateServerFlow'

type Props = Pick<NexusStore, 'closeAddServerModal' | 'createServer' | 'joinServerByInvite'>

export function AddServerModal({ closeAddServerModal, createServer, joinServerByInvite }: Props) {
  return (
    <motion.div
      className="add-server-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <CreateServerFlow createServer={createServer} joinServerByInvite={joinServerByInvite} onClose={closeAddServerModal} />
    </motion.div>
  )
}
