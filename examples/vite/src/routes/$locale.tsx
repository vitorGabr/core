import { createFileRoute } from '@tanstack/react-router'
import { useI18n } from '../locale/client';

export const Route = createFileRoute('/$locale')({
  component: Home,
})


function Home() {
  const t = useI18n();


  return (
    <div>
      <h3>{t('hello')}</h3>
    </div>
  )
}