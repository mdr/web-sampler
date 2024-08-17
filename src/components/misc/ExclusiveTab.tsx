import { FC, ReactNode, useEffect, useState } from 'react'
import { useTimeout } from 'react-use'

import { Millis } from '../../utils/types/brandedTypes.ts'
import { doNothing, unawaited } from '../../utils/utils.ts'

export interface ExclusiveTabProps {
  children: ReactNode
  fallback?: ReactNode
}

const LOADING_FLASH_TIMEOUT = Millis(500)

export const ExclusiveTab: FC<ExclusiveTabProps> = ({ children, fallback }) => {
  const [timeoutHasExpired] = useTimeout(LOADING_FLASH_TIMEOUT)
  const [isTabLeader, setIsTabLeader] = useState(false)
  useEffect(() => {
    unawaited(
      navigator.locks.request('tabLeader', () => {
        setIsTabLeader(true)
        return new Promise(doNothing)
      }),
    )
  })

  return isTabLeader ? <div>{children}</div> : timeoutHasExpired() ? fallback : undefined
}
