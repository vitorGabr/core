import { createFileRoute, useParams } from '@tanstack/react-router'
import { useI18n } from '../locale/client'
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const t = useI18n();
  const params = useParams({ strict: false })
console.log(params)


  return (
    <div className="p-2">
      <h3>{t('hello')}</h3>
    </div>
  )
}