import Link from "next/link"
import { ModeToggle } from "./ModeToggle"

export default async function Navbar() {

  return (
    <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 border-b dark:bg-[rgba(29,29,29,1)]">
      <div className="relative flex h-16 items-center justify-between">
        <div>
          <Link href="/">
            <h2 className="font-bold">NicheTensor</h2>
          </Link>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0" >
          <ModeToggle/>
        </div>
      </div>
    </div>
  )
}