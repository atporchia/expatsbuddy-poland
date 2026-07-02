import { Switch, Route, Router as WouterRouter } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import PathPage from "@/pages/PathPage";
import GlossaryPage from "@/pages/GlossaryPage";
import GlossaryTermPage from "@/pages/GlossaryTermPage";
import StartPage from "@/pages/StartPage";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/categories/:categorySlug" component={CategoryPage} />
        <Route path="/paths/:pathSlug" component={PathPage} />
        <Route path="/glossary" component={GlossaryPage} />
        <Route path="/glossary/:termSlug" component={GlossaryTermPage} />
        <Route path="/start" component={StartPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
