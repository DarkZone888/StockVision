import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import Logo from "@/components/images/text.ico";

interface HeaderProps {
  user: User;
}

const Header = async ({ user }: HeaderProps) => {
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 md:h-16 md:px-6 lg:px-8">
        {/* Logo + Brand name */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="StockVision"
              width={160}
              height={52}
              className="h-7 w-auto md:h-8"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-100">
                STOCK VISION
              </span>
              <span className="hidden text-[9px] uppercase tracking-[0.16em] text-zinc-500 sm:inline">
                MARKET DASHBOARD
              </span>
            </div>
          </div>
        </Link>

        {/* Center nav (desktop) */}
        <nav className="hidden flex-1 justify-center sm:flex">
          <NavItems initialStocks={initialStocks} />
        </nav>

        {/* Right: user */}
        <div className="flex items-center gap-2">
          <UserDropdown user={user} initialStocks={initialStocks} />
        </div>
      </div>
    </header>
  );
};

export default Header;
