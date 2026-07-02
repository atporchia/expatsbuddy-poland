import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { DEFAULT_LOCALE } from "@/lib/routes";
import LocaleLayout from "@/pages/LocaleLayout";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import PathPage from "@/pages/PathPage";
import GlossaryPage from "@/pages/GlossaryPage";
import GlossaryTermPage from "@/pages/GlossaryTermPage";
import StartPage from "@/pages/StartPage";

function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">
          The page you&rsquo;re looking for doesn&rsquo;t exist.
        </p>
        <a
          href={`/${DEFAULT_LOCALE}`}
          className="mt-4 inline-block text-blue-700 hover:underline"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <div className="flex min-h-full flex-col bg-[#f8fafc] text-[#0f172a]">
      <Switch>
        <Route path="/">
          <Redirect to={`/${DEFAULT_LOCALE}`} />
        </Route>
        <Route path="/:locale">
          {(params) => (
            <LocaleLayout locale={params.locale}>
              <HomePage locale={params.locale} />
            </LocaleLayout>
          )}
        </Route>
        <Route path="/:locale/categories/:categorySlug">
          {(params) => (
            <LocaleLayout locale={params.locale}>
              <CategoryPage locale={params.locale} categorySlug={params.categorySlug} />
            </LocaleLayout>
          )}
        </Route>
        <Route path="/:locale/paths/:pathSlug">
          {(params) => (
            <LocaleLayout locale={params.locale}>
              <PathPage locale={params.locale} pathSlug={params.pathSlug} />
            </LocaleLayout>
          )}
        </Route>
        <Route path="/:locale/glossary">
          {(params) => (
            <LocaleLayout locale={params.locale}>
              <GlossaryPage locale={params.locale} />
            </LocaleLayout>
          )}
        </Route>
        <Route path="/:locale/glossary/:termSlug">
          {(params) => (
            <LocaleLayout locale={params.locale}>
              <GlossaryTermPage locale={params.locale} termSlug={params.termSlug} />
            </LocaleLayout>
          )}
        </Route>
        <Route path="/:locale/start">
          {(params) => (
            <LocaleLayout locale={params.locale}>
              <StartPage locale={params.locale} />
            </LocaleLayout>
          )}
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AppRoutes />
    </WouterRouter>
  );
}

export default App;
