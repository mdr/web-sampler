import { doNothing, unawaited } from '../../utils/utils.ts'
import { FC, ReactNode, useEffect, useState } from 'react'

export interface ExclusiveTabProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ExclusiveTab: FC<ExclusiveTabProps> = ({ children, fallback }) => {
  const [isTabLeader, setIsTabLeader] = useState(false)
  useEffect(() => {
    unawaited(
      navigator.locks.request('tabLeader', () => {
        setIsTabLeader(true)
        return new Promise(doNothing)
      }),
    )
  })

  return isTabLeader ? <div>{children}</div> : fallback
}
