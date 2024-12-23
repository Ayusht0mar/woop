import { CircleUserRound } from "lucide-react";
import SearchBar from "../SearchBar";
import UserAvatar from "../auth/UserAvatar";
import {ModeToggle} from "../ModeToggle";

const Navbar = () => {
    return ( 
        <div className="mx-auto max-w-6xl flex flex-col gap-y-2 w-[90vw] lg:w-[80vw] mt-4 border rounded-xl border-black/[0.13] dark:bg-black shadow-md">
            
            <div className="flex justify-between pt-3 px-3">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-400 rounded-md">

                    </div>
                    <h1>Woop</h1>
                </div>
                <div className="flex items-center gap-3">
                    <ModeToggle/>
                    <UserAvatar/>
                </div>

            </div>


            <SearchBar/>
        </div>
     );
}
 
export default Navbar;