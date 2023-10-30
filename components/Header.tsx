"use client";
import useDebounce from "@/hooks/useDebounce";
import { useBoardStore } from "@/store/BoardStore";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Avatar from "react-avatar";
const Header = () => {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);
  const { value: debouncedValue } = useDebounce(searchString, setSearchString);

  return (
    <header>
      <div className="bg- flex flex-col items-center bg-gray-500/10 p-5 md:flex-row">
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello logo"
          width={300}
          height={100}
          className="w-44 object-contain pb-10 md:w-56 md:pb-0"
        />
        <div className="absolute left-0 top-0 -z-50 h-96 w-full rounded-md bg-gradient-to-br from-pink-400 to-[#0055D1] opacity-50 blur-3xl filter" />

        <div className="flex w-full flex-1 items-center justify-end space-x-5">
          {/* Search Box */}
          <form className="flex flex-1 items-center space-x-5 rounded-md bg-white p-2 shadow-md md:flex-initial ">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={debouncedValue}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 p-2 outline-none "
            />
            <button hidden>Search</button>
          </form>
          <Avatar name="Jordan Nguyen" size="50" round />
        </div>
      </div>
      <div className=" flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex w-fit max-w-3xl items-center rounded-xl bg-white p-5 pr-5 text-sm font-light italic text-[#0055D1] shadow-xl">
          <UserCircleIcon className="mr-1 inline-block h-10 w-10 text-[#0055D1]" />
          GPT is summarizing your tasks for the day...
        </p>
      </div>
    </header>
  );
};

export default Header;
