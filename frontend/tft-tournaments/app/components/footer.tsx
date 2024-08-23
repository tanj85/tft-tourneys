import Link from "next/link";
import { FaDiscord } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <>
      <div className="flex flex-col items-center my-8  relative z-20 mx-[10vw]">
        <div className="text-sm text-center text-whitish mb-6">
          TFTourneys was created under Riot Games&apos; &quot;Legal Jibber
          Jabber&quot; policy using assets owned by Riot Games. Riot Games does
          not endorse or sponsor this project.
          <p className="mt-1">
            &copy; 2024 TFTourneys. Content on this site is licensed under CC
            BY-SA 4.0. Some tournament data was taken from Liquipedia.net under
            their CC BY-SA license.
          </p>
        </div>
        <div className="flex gap-6 items-center">
          <Link
            href="https://discord.gg/gPvXy4Nxt4"
            rel="noopener noreferrer"
            target="_blank"
            className="text-whitish transition ease-in-out delay-50 hover:scale-110 duration-200"
          >
            <FaDiscord className="w-8 h-8" />
          </Link>
          <Link
            href="https://x.com/tftourneys_"
            rel="noopener noreferrer"
            target="_blank"
            className="text-whitish transition ease-in-out delay-50 hover:scale-110 duration-200"
          >
            <FaXTwitter className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </>
  );
}
