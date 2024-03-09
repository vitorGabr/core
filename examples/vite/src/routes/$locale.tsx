import { createFileRoute, useParams } from '@tanstack/react-router'
import { useI18n } from '../locale/client';

export const Route = createFileRoute('/$locale')({
  component: Home,
})

function Home() {
  const params = useParams({ strict: false })
  console.log(params)
  const t = useI18n();

  return (
    <div className="p-2">
      <h3>{t('hello')}</h3>
    </div>
  )
}