import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { I18nProvider } from '../locale/client'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return <p>Not Found (on root route)</p>
  },
})

function RootComponent() {
  return (
    <I18nProvider>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          pt-br
        </Link>{' '}
        <Link
          to="/$locale"
          params={{ locale: 'en' }}
          activeProps={{
            className: 'font-bold',
          }}

        >
          en
        </Link>
      </div>
      <hr />
      <Outlet />
    </I18nProvider>
  )
}