import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import { Head } from "./head";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main
        className="container max-w-7xl px-6 flex-grow"
        style={{ margin: "auto" }}
      >
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://portfolio.site.ryotanny.com"
          title="my portfolio"
        >
          <span className="text-default-600">©︎ ryotanny</span>
        </Link>
      </footer>
    </div>
  );
}
