import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/images/text.ico";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-black/95">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-[11px] text-zinc-500 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
              <Image
                src={Logo}
                alt="StockVision"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium text-zinc-200">
                Stock Vision
              </span>
              <span className="text-[10px] text-zinc-500">
                Modern stock market platforms.
              </span>
            </div>
          </Link>
        </div>

        {/* Right: links + year */}
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <p className="text-[11px] text-zinc-500">© {year} Stock Vision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
